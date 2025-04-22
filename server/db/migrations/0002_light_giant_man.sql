ALTER TABLE "files" RENAME TO "file";--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "files_document_id_document_id_fk";
--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;