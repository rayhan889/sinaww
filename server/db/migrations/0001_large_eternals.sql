CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" varchar NOT NULL,
	"file_type" varchar NOT NULL,
	"path" varchar NOT NULL,
	"document_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;