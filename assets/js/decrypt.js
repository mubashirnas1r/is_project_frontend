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
async function decrypt() {
    const password = document.getElementById("password").value;
    const image = document.getElementById("image").files[0];

    if (!password || !image) {
        showError("All fields are required.");
        return;
    }
    

    const formData = new FormData();
    formData.append("password", password);
    formData.append("image", image);
    HideResult();
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = '<span class="loader" style="display: inline-block;"></span>';

    try {
        const response = await fetch("http://127.0.0.1:8000/v1/decrypt", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            showResult(`Decrypted Message: '${data.message}'`);
        } else {
            const data = await response.json();
            showError(`Error: ${data.message}`);
        }
    } catch (error) {
        showError(`Unexpected error: ${error.message}`);
    } finally {
        button.disabled = false;
        button.innerHTML = 'Decrypt';
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