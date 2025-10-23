import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for contest photo uploads
export const ourFileRouter = {
  contestImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Contest photo uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
