//  Convert selected photo/file to base64...
export function convertImageToBase64(formData) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    const file = formData.get("avatar"); // Replace 'file' with the key you used in FormData
    if (file instanceof File) {
      reader.readAsDataURL(file);
    } else {
      reject(new Error("No file selected"));
    }
  });
}
