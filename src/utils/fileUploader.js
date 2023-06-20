import { BASE_URI } from "../data/constants";
import * as axios from "axios";

export default async function uploadFile(fileUri, fileName, fileType, options) {
    const formData = new FormData();

    formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: fileType
    });

    formData.append("is_private", 1);


    if (options?.isPrivate) {
        formData.append('is_private', '1');
    }

    if (options?.folder) {
        formData.append('folder', options.folder);
    } else {
        formData.append("folder", "Home");
    }

    if (options?.file_url) {
        formData.append('file_url', options.file_url);
    }
    if (options?.doctype && options?.docname) {
        formData.append('doctype', options.doctype);
        formData.append('docname', options.docname);
        if (options?.fieldname) {
            formData.append('fieldname', options.fieldname);
        }
    }

    axios.post(`${BASE_URI}/api/method/upload_file`, formData, {
        headers: {
            Authorization: `Bearer ${options?.accessToken}`,
            "Content-Type": "multipart/form-data"
        },
        transformRequest: (data) => {
            return data;
        },
        onUploadProgress: (progressEvent) => {
            if (options?.onUploadProgress)
                options.onUploadProgress(progressEvent);
        }
    }).then((res) => {
        if (options?.onUploadComplete)
            options.onUploadComplete(res.data);
    }).catch((error) => {
        console.log("Error uploading file!")
        throw {
            httpStatus: error.response.status,
            httpStatusText: error.response.statusText,
            message: error.response.data.message ?? 'There was an error while uploading the file.',
            exception: error.response.data.exception ?? '',
        }
    })
}