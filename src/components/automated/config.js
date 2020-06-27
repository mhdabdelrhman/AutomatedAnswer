export default [
  {
    id: "send-photo",
    text: "Send photo",
    inputs: [
      {
        icon: "mdi-camera",
        placeholder: "Pick an avatar",
        input_type: "file",
        data_type: "photo",
        accept: "image/*",
      },
      {
        icon: "mdi-web",
        placeholder: "Set avatar URL",
        input_type: "text",
        data_type: "url",
      },
    ],
  },
  {
    id: "send-audio",
    text: "Send audio",
    inputs: [
      {
        icon: "mdi-phone-outline",
        placeholder: "Pick a voice",
        input_type: "file",
        data_type: "audio",
        accept: "audio/*",
      },
      {
        icon: "mdi-web",
        placeholder: "Set voice URL",
        input_type: "text",
        data_type: "url",
        required: false,
      },
    ],
  },
  {
    id: "send-video",
    text: "Send video",
    inputs: [
      {
        icon: "mdi-video",
        placeholder: "Pick a video",
        input_type: "file",
        data_type: "video",
        accept: "video/*",
        required: false,
      },
      {
        icon: "mdi-web",
        placeholder: "Set video URL",
        input_type: "text",
        data_type: "url",
        required: false,
      },
    ],
  },
  {
    id: "send-document",
    text: "Send document",
    inputs: [
      {
        icon: "mdi-file-document",
        placeholder: "Pick a document",
        input_type: "file",
        data_type: "document",
        accept: ".pdf, .doc, .docx",
      },
      {
        icon: "mdi-web",
        placeholder: "Set document URL",
        input_type: "text",
        data_type: "url",
      },
    ],
  },
  {
    id: "send-rss",
    text: "Send RSS",
    inputs: [
      {
        icon: "mdi-web",
        placeholder: "Set RSS URL",
        input_type: "text",
        data_type: "url",
      },
    ],
  },
  {
    id: "ask-email",
    text: "Ask for user email",
    title: "Email",
  },
  {
    id: "ask-phone",
    text: "Ask for user phone number",
    title: "Phone Number",
  },
  {
    id: "ask-photo",
    text: "Ask user to send a photo",
    title: "Photo",
  },
  {
    id: "ask-audio",
    text: "Ask user to send an audio",
    title: "Audio",
  },
  {
    id: "ask-video",
    text: "Ask user to send a video",
    title: "Video",
  },
  {
    id: "ask-document",
    text: "Ask user to send a document",
    title: "Document",
  },
  {
    id: "ask-contact",
    text: "Ask user to send contact CSV file",
    title: "Contact",
  },
  {
    id: "ask-gps",
    text: "Ask user to send GPS location",
    title: "GPS",
  },
];
