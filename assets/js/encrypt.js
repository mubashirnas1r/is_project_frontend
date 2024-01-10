function goBack() {
    window.history.back();
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector('.reveal-password');

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        
    } else {
        passwordInput.type = "password";
        
    }
}
function autoAdjustTextarea() {
    const textarea = document.getElementById("message");
    const maxRows = 8;

    textarea.style.height = "auto";
    textarea.style.height = (Math.min(textarea.scrollHeight, maxRows * 20) + 2) + "px";
}

document.getElementById("message").addEventListener("input", autoAdjustTextarea);

async function encrypt() {
    const message = document.getElementById("message").value;
    const password = document.getElementById("password").value;
    const imageInput = document.getElementById("image");
    const image = imageInput.files[0];

    if (!message || !password || !image) {
        showError("All fields are required.");
        return;
    }

    const formData = new FormData();
    formData.append("message", message);
    formData.append("password", password);
    formData.append("image", image);

    HideResult();
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = '<span class="loader" style="display: inline-block;"></span>';

    try {
        const response = await fetch("http://127.0.0.1:8000/v1/encrypt", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
            const suggestedFilename = filenameMatch ? filenameMatch[1] : 'encrypted_image.png';
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = suggestedFilename;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showResult("Encryption successful!");
        } else {
            const data = await response.json();
            showError(`Error: ${data.message}`);
        }
    } catch (error) {
        showError(`Unexpected error: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = 'Encrypt';
    }
}

function HideResult() {
    document.getElementById("result").innerHTML = "";
    document.querySelector('.error-message').style.display = 'none';
}

function showResult(message) {
    document.getElementById("result").innerHTML = message;
    document.getElementById("result").style.color = "#4caf50";
    document.querySelector('.error-message').style.display = 'none';
}

function showError(message) {
    document.querySelector('.error-message').innerHTML = message;
    document.querySelector('.error-message').style.display = 'block';
    document.getElementById("result").innerHTML = "";
}