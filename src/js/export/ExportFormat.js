export class ExportFormat {
    export(calendar) {
        throw new Error('export must be implemented');
    }

    download(data, filename, mimetype) {

        const blobData = new Blob([data], { type: mimetype });

        const anchorElement = document.createElement("a");
        const fileUrl = URL.createObjectURL(blobData);

        anchorElement.href = fileUrl;
        anchorElement.download = filename;
        document.body.appendChild(anchorElement);

        anchorElement.addEventListener('click', function(e) {
            setTimeout(() => {
                document.body.removeChild(anchorElement);
                URL.revokeObjectURL(fileUrl);
            }, 0);
        }, { once: true });

        anchorElement.click();

    }
}