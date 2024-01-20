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
function openLinkInNewTab() {
    var link = "https://www.pythonanywhere.com/user/mubash1r/files/home/mubash1r/encryption_images/encrypted_image.png";
    window.open(link, '_blank');
  }
function encrypt() {
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

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://mubash1r.pythonanywhere.com/v1/encrypt", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
        
            showResult("Encryption successful! Please save the upcoming image to use it for future Decryption! <br>OPENING IMAGE ...<br> Note: Please Allow Popups to see the Image.");
            setTimeout(openLinkInNewTab, 4000);
        } else {
            const data = JSON.parse(xhr.response);
            showError(`Error: ${data.message}`);
        }

        button.disabled = false;
        button.innerHTML = 'Encrypt';
    };

    xhr.onerror = function () {
        showError(`Unexpected error: ${xhr.statusText}`);
        button.disabled = false;
        button.innerHTML = 'Encrypt';
    };

    xhr.send(formData);

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
