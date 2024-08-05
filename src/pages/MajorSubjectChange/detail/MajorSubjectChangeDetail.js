import ContentLayout from "../../../components/ContentLayout";
import Header from "../../../components/courseHeader";

export default function MajorSubjectChangeDetail() {
  return (
    <div className="flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Thông tin học phần
        </h1>
      </div>
    </div>
  );
}
