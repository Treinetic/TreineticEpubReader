// Metadata.ts
export class Metadata {
    identifier?: string;
    title?: string;
    author?: string;
    description?: string;
    publisher?: string;
    language?: string;
    rights?: string;
    modifiedDate?: string;
    publishedDate?: string;
    epubVersion?: string;

    constructor(packageMetadata?: any) {
        if (packageMetadata) {
            this.identifier = packageMetadata.id;
            this.title = packageMetadata.title;
            this.author = packageMetadata.author;
            this.description = packageMetadata.description;
            this.language = packageMetadata.language;
            this.publisher = packageMetadata.publisher;
            this.rights = packageMetadata.rights;
            this.modifiedDate = packageMetadata.modified_date;
            this.publishedDate = packageMetadata.pubdate;
            this.epubVersion = packageMetadata.epub_version;
        }
    }
}
