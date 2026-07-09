import { mkdir, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export type VercelDeployInput = {
  projectName: string;
  githubOwner: string;
  githubRepo: string;
  publishDir: string;
};

async function runVercelDeploy(publishDir: string) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN이 .env.local에 없습니다.");

  const command = process.platform === "win32" ? "cmd.exe" : "npx";
  const args =
    process.platform === "win32"
      ? ["/c", "npx", "vercel", "--prod", "--yes", "--token", token]
      : ["vercel", "--prod", "--yes", "--token", token];

  const result = await execFileAsync(command, args, {
    cwd: publishDir,
    windowsHide: true,
  });

  return result.stdout;
}

export async function createVercelProject(input: VercelDeployInput) {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) throw new Error("VERCEL_TOKEN이 .env.local에 없습니다.");

  const query = teamId ? `?teamId=${teamId}` : "";

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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const getData = await getRes.json();

    if (!getRes.ok) {
      throw new Error(`Vercel 프로젝트 확인 실패: ${JSON.stringify(getData)}`);
    }

    projectId = getData.id;
    orgId = getData.accountId;
  }

  const vercelDir = path.join(input.publishDir, ".vercel");
  await mkdir(vercelDir, { recursive: true });

  await writeFile(
    path.join(vercelDir, "project.json"),
    JSON.stringify(
      {
        projectId,
        orgId,
      },
      null,
      2
    ),
    "utf-8"
  );

  const deployLog = await runVercelDeploy(input.publishDir);

  const urlMatch = deployLog.match(/https:\/\/[^\s]+/);
  const deploymentUrl = urlMatch?.[0] || `https://${input.projectName}.vercel.app`;

  return {
    projectName: input.projectName,
    projectId,
    deployed: true,
    reused,
    vercelUrl: `https://${input.projectName}.vercel.app`,
    deploymentUrl,
  };
}

