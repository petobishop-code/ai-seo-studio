import ProjectForm from "./project-form";

export default function ProjectPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-slate-400">프로젝트 관리</p>

        <h1 className="mt-2 text-3xl font-bold">프로젝트 생성</h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          웹사이트 상위노출 작업의 시작점입니다. 프로젝트를 만들면 이후
          웹사이트 등록, AI Writer, AI SEO, 자동 발행 기능으로 확장됩니다.
        </p>
      </div>

      <ProjectForm />
    </>
  );
}