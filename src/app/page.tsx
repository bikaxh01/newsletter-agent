"use client";
import GenerateForm from "@/components/form/generateForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState("");
  console.log("🚀 ~ Home ~ previewData:", previewData);

  return (
    <>
      <div className=" h-screen">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <GenerateForm
              previewResponse={setPreviewData}
              newsLetter={previewData}
              loading={loading}
              setLoading={setLoading}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {!loading && !previewData ? (
              <div className=" h-full w-full  flex items-center justify-center font-semibold">
                Fill the form to generate news-letter
              </div>
            ) : loading || !previewData ? (
              <div className=" h-full w-full  flex  flex-col items-center justify-center font-semibold">
                <Loader2Icon className=" animate-spin" />
                <span className=" text-gray-600">Generating...This may take 1-2 min</span>
              </div>
            ) : (
              <iframe
                className=" w-full h-screen"
                srcDoc={previewData}
              ></iframe>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
