export const navLinks = [
    {
      label: "Home",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Image Restore",
      route: "/transformations/add/restore",
      icon: "/assets/icons/image.svg",
    },
    {
      label: "Generative Fill",
      route: "/transformations/add/fill",
      icon: "/assets/icons/gen-fill.svg",
    },
    {
      label: "Object Remove",
      route: "/transformations/add/remove",
      icon: "/assets/icons/object-removal.svg",
    },
    {
      label: "Object Recolor",
      route: "/transformations/add/recolor",
      icon: "/assets/icons/recoloring.svg",
    },
    {
      label: "Background Remove",
      route: "/transformations/add/removeBackground",
      icon: "/assets/icons/bg-removal.svg", 
    },
    {
      label: "Image Rotation",
      route: "/transformations/add/rotation",
      icon: "/assets/icons/filter.svg",
    },
    {
      label: "Image Summarization",
      route: "/transformations/add/summarization",
      icon: "/assets/icons/image-summarize.svg", 
    },
    {
      label: "Noise Removal",
      route: "/transformations/add/noiseRemoval",
      icon: "/assets/icons/stars.svg",
    },
    {
      label: "Super Resolution",
      route: "/transformations/add/superResolution",
      icon: "/assets/icons/search.svg", 
    },
    {
      label: "Age Manipulation",
      route: "/transformations/add/ageManipulation",
      icon: "/assets/icons/age-manipulation.svg",
    },
    {
      label: "Format Conversion",
      route: "/transformations/add/formatConversion",
      icon: "/assets/icons/format_conversion.svg", 
    },
    {
      label: "Cartoon Stylization",
      route: "/transformations/add/cartoonStylization",
      icon: "/assets/icons/scan.svg", 
    },
    {
      label: "Contrast Enhancement",
      route: "/transformations/add/contrastEnhancement",
      icon: "/assets/icons/contrast-enhancement.svg", 
    },
    {
      label: "Pixel Art",
      route: "/transformations/add/pixelArt",
      icon: "/assets/icons/pixelart1.svg",
    },
    {
      label: "Pixel Art Background",
      route: "/transformations/add/pixelArtBackground",
      icon: "/assets/icons/pixelart2.svg", 
    },
    {
      label: "Pixel Art Character",
      route: "/transformations/add/pixelArtCharacter",
      icon: "/assets/icons/pixelart3.svg",
    },
    {
      label: "Watermark",
      route: "/transformations/add/watermark",
      icon: "/assets/icons/watermark.svg",
    },
    {
      label: "Buy Credits",
      route: "/credits",
      icon: "/assets/icons/bag.svg",
    },
  ];
  
  export const plans = [
    {
      _id: 1,
      name: "Free",
      icon: "/assets/icons/free-plan.svg",
      price: 0,
      credits: 20,
      inclusions: [
        {
          label: "20 Free Credits",
          isIncluded: true,
        },
        {
          label: "Basic Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: false,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Pro Package",
      icon: "/assets/icons/free-plan.svg",
      price: 40,
      credits: 120,
      inclusions: [
        {
          label: "120 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Premium Package",
      icon: "/assets/icons/free-plan.svg",
      price: 199,
      credits: 2000,
      inclusions: [
        {
          label: "2000 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: true,
        },
      ],
    },
  ];
  
  export const transformationTypes = {
    restore: {
      type: "restore",
      title: "Restore Image",
      subTitle: "Refine images by removing noise and imperfections",
      config: { restore: true },
      icon: "image.svg",
    },
    removeBackground: {
      type: "removeBackground",
      title: "Background Remove",
      subTitle: "Removes the background of the image using AI",
      config: { removeBackground: true },
      icon: "camera.svg",
    },
    fill: {
      type: "fill",
      title: "Generative Fill",
      subTitle: "Enhance an image's dimensions using AI outpainting",
      config: { fillBackground: true },
      icon: "stars.svg",
    },
    remove: {
      type: "remove",
      title: "Object Remove",
      subTitle: "Identify and eliminate objects from images",
      config: {
        remove: { prompt: "", removeShadow: true, multiple: true },
      },
      icon: "scan.svg",
    },
    recolor: {
      type: "recolor",
      title: "Object Recolor",
      subTitle: "Identify and recolor objects from the image",
      config: {
        recolor: { prompt: "", to: "", multiple: true },
      },
      icon: "filter.svg",
    },
    rotation: {
      type: "rotation",
      title: "Image Alignment and Rotation",
      subTitle: "Rotate and align your image",
      config: { rotation: true },
      icon: "camera.svg", // TO-DO
    },
    summarization: {
      type: "summarization",
      title: "Image Summarization",
      subTitle: "Summarize the context of the image",
      config: { summarization: true},
      icon: "camera.svg", // TO-DO
    },
    noiseRemoval: {
      type: "noiseRemoval",
      title: "Noise Removal",
      subTitle: "Remove noise from image",
      config: {noiseRemoval: true},
      icon: "camera.svg", // TO-DO
    },
    superResolution: {
      type: "superResolution",
      title: "Super Resolution",
      subTitle: "Increase the resolution of the image",
      config: { superResolution: true},
      icon: "search.svg", // TO-DO 
    },
    ageManipulation: {
      type: "ageManipulation",
      title: "Age Manipulation",
      subTitle: "Manipulate the ages of people in photos, make them older.",
      config: { ageManipulation: true},
      icon: "camera.svg", // TO-DO
    },
    formatConversion: {
      type: "formatConversion",
      title: "Format Conversion",
      subTitle: "Convert your images to different formats.",
      config: { formatConversion: true},
      icon: "format_conversion.svg", // TO-DO
    },
    cartoonStylization: {
      type: "cartoonConversion",
      title: "Cartoon Stylization",
      subTitle: "Make your image cartoon-ish.",
      config: { cartoonStylization: true},
      icon: "camera.svg", // TO-DO
    },
    contrastEnhancement: {
      type: "contrastEnhancement",
      title: "Contrast Enhancement",
      subTitle: "Adjust your image contrast.",
      config: { contrastEnhancement: true },
      icon: "camera.svg", // TO-DO
    },
    pixelArt: {
      type: "pixelArt",
      title: "Pixel Art",
      subTitle: "Transform to pixel art.",
      config: { pixelArt:true },
      icon: "camera.svg", // TO-DO
    },
    pixelArtBackground: {
      type: "pixelArtbackground",
      title: "Pixel Art Background",
      subTitle: "Create backgrounds with pixel art style.",
      config: { pixelArtBackground:true },
      icon: "camera.svg" // TO-DO
    },
    pixelArtCharacter: {
      type: "pixelArtCharacter",
      title: "Pixel Art Character",
      subTitle: "Create characters with pixel art style.",
      config: { pixelArtCharacter: true},
      icon: "camera.svg" // TO-DO
    }
    
  };
  
  export const aspectRatioOptions = {
    "1:1": {
      aspectRatio: "1:1",
      label: "Square (1:1)",
      width: 1000,
      height: 1000,
    },
    "3:4": {
      aspectRatio: "3:4",
      label: "Standard Portrait (3:4)",
      width: 1000,
      height: 1334,
    },
    "9:16": {
      aspectRatio: "9:16",
      label: "Phone Portrait (9:16)",
      width: 1000,
      height: 1778,
    },
  };
  
  export const defaultValues = {
    title: "",
    aspectRatio: "",
    color: "",
    prompt: "",
    publicId: "",
  };
  
  export const creditFee = -1;
