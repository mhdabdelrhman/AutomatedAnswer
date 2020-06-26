export default [
    {
        text: "Send photo",
        icon: "mdi-camera",
        placeholder: "Pick an avatar",
        type: "file",
        input: {
            data_type: "photo",
            accept: "image/png, image/jpeg, image/bmp",
            required: "file-or-url", // file-or-url, file, url
        }
    },
    {
        text: "Send audio",
        icon: "mdi-phone-outline",
        placeholder: "Pick an voice",
        type: "file",
        input: {
            data_type: "audio",
            accept: "MP3/mp3, M4A/m4a",
            required: "file-or-url",
        }
    },
    {
        text: "Send video",
        icon: "mdi-video",
        placeholder: "Pick an video",
        type: "file",
        input: {
            data_type: "video",
            accept: "video/mp4, video/mkv",
            required: "file-or-url",
        }
    },
    {
        text: "Send document",
        icon: "mdi-file-document",
        placeholder: "Pick an document",
        type: "file",
        input: {
            data_type: "document",
            accept: "PSD/psd, PDF/pdf",
            required: "file-or-url",
        }
    },
    {
        text: "Send RSS",
        icon: "mdi-web",
        placeholder: "Set RSS URL",
        type: "text",
        input: {
            data_type: "url",
            required: "url", // url
        }
    },
    {
        text: "Ask for user email",
        title: "Email",
        icon: "mdi-email",
        placeholder: "Email address",
        type: "text",
        input: {
            data_type: "email"
        }
    },
    {
        text: "Ask for user phone number",
        title: "Phone Number",
        icon: "mdi-phone-outline",
        placeholder: "Phone number",
        type: "text",
        input: {
            data_type: "phone_number"
        }
    },
    {
        text: "Ask user to send a photo",
        title: "Photo",
        icon: "mdi-web",
        placeholder: "Photo url",
        type: "text",
        input: {
            data_type: "photo"
        }
    },
    {
        text: "Ask user to send an audio",
        title: "Audio",
        icon: "mdi-web",
        placeholder: "Audio url",
        type: "text",
        input: {
            data_type: "audio"
        }
    },
    {
        text: "Ask user to send a video",
        title: "Video",
        icon: "mdi-web",
        placeholder: "Video url",
        type: "text",
        input: {
            data_type: "video"
        }
    },
    {
        text: "Ask user to send a document",
        title: "Document",
        icon: "mdi-web",
        placeholder: "Document url",
        type: "text",
        input: {
            data_type: "document"
        }
    },
    {
        text: "Ask user to send contact CSV file",
        title: "Contact",
        icon: "mdi-web",
        placeholder: "Contact url",
        type: "text",
        input: {
            data_type: "contact"
        }
    },
    {
        text: "Ask user to send GPS location",
        title: "GPS",
        icon: "mdi-web",
        placeholder: "GPS data",
        type: "text",
        input: {
            data_type: "gps"
        }
    },
];