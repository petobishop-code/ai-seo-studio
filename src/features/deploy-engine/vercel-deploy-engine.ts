import { mkdir, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export type EnsureVercelProjectInput = {
  projectName: string;
  githubOwner: string;
  githubRepo: string;
};

export type VercelProject = {
  projectName: string;
  projectId: string;
  orgId: string;
  /** Vercel이 실제로 배정한 도메인. 이름이 선점되면 surinam-three.vercel.app 처럼 접미사가 붙는다. */
  siteUrl: string;
  reused: boolean;
};

function requireToken() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN이 .env.local에 없습니다.");
  return token;
}

function teamQuery() {
  const teamId = process.env.VERCEL_TEAM_ID;
  return teamId ? `?teamId=${teamId}` : "";
}

/**
 * Vercel이 프로젝트에 실제로 배정한 production 도메인을 조회한다.
 * `${projectName}.vercel.app` 은 전역에서 유일해 이미 선점됐을 수 있으므로 추측하면 안 된다.
 */
async function getProductionDomain(projectName: string, token: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectName}/domains${teamQuery()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Vercel 도메인 조회 실패: ${JSON.stringify(data)}`);
  }

  const domains: Array<{
    name: string;
    verified?: boolean;
    gitBranch?: string | null;
  }> = data.domains ?? [];

  // 브랜치 전용 도메인이 아닌, production 도메인을 고른다.
  const production = domains.find(
    (domain) => !domain.gitBranch && domain.name.endsWith(".vercel.app")
  );

  if (!production) {
    throw new Error(
      `Vercel 프로젝트 ${projectName}에 배정된 도메인을 찾지 못했습니다.`
    );
  }

  return `https://${production.name}`;
}

/**
 * 배포 보호(Vercel Authentication)를 끈다.
 * 켜져 있으면 *.vercel.app 접근에 로그인이 필요해 검색엔진 크롤러가 401을 받는다.
 */
async function disableDeploymentProtection(projectName: string, token: string) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectName}${teamQuery()}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ssoProtection: null }),
    }
  );

  if (!res.ok) {
    const data = await res.text();
    throw new Error(`Vercel 배포 보호 해제 실패: ${data}`);
  }
}

/**
 * 브랜드 저장소에 연결된 Vercel 프로젝트를 보장하고, 실제 도메인을 돌려준다.
 * 사이트 HTML을 만들기 전에 호출해야 canonical/sitemap이 올바른 도메인을 가리킨다.
 */
export async function ensureVercelProject(
  input: EnsureVercelProjectInput
): Promise<VercelProject> {
  const token = requireToken();
  const query = teamQuery();

  let projectId = "";
  let orgId = "";
  let reused = false;

  const createRes = await fetch(`https://api.vercel.com/v11/projects${query}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.projectName,
      framework: null,
      gitRepository: {
        type: "github",
        repo: `${input.githubOwner}/${input.githubRepo}`,
      },
    }),
  });

  const createData = await createRes.json();

  if (createRes.ok) {
    projectId = createData.id;
    orgId = createData.accountId;
  } else {
    reused = true;

    const getRes = await fetch(
      `https://api.vercel.com/v9/projects/${input.projectName}${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const getData = await getRes.json();

    if (!getRes.ok) {
      throw new Error(`Vercel 프로젝트 확인 실패: ${JSON.stringify(getData)}`);
    }

    projectId = getData.id;
    orgId = getData.accountId;
  }

  // 신규 프로젝트는 배포 보호가 기본으로 켜지므로 매번 꺼준다.
  await disableDeploymentProtection(input.projectName, token);

  const siteUrl = await getProductionDomain(input.projectName, token);

  return {
    projectName: input.projectName,
    projectId,
    orgId,
    siteUrl,
    reused,
  };
}

export async function deployVercel(input: {
  publishDir: string;
  projectId: string;
  orgId: string;
}) {
  const token = requireToken();

  const vercelDir = path.join(input.publishDir, ".vercel");
  await mkdir(vercelDir, { recursive: true });

  await writeFile(
    path.join(vercelDir, "project.json"),
    JSON.stringify({ projectId: input.projectId, orgId: input.orgId }, null, 2),
    "utf-8"
  );

  const command = process.platform === "win32" ? "cmd.exe" : "npx";
  const args =
    process.platform === "win32"
      ? ["/c", "npx", "vercel", "--prod", "--yes", "--token", token]
      : ["vercel", "--prod", "--yes", "--token", token];

  const result = await execFileAsync(command, args, {
    cwd: input.publishDir,
    windowsHide: true,
  });

  const urlMatch = result.stdout.match(/https:\/\/[^\s]+/);

  return {
    deployed: true,
    deploymentUrl: urlMatch?.[0] ?? "",
  };
}
