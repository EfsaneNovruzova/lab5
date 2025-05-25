let userData = null;

if (localStorage.getItem("userData")) {
    userData = JSON.parse(localStorage.getItem("userData"));
} else {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            userData = data;
            localStorage.setItem("userData", JSON.stringify(userData));
            location.reload();
        });
}

document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        btn.nextElementSibling.classList.toggle("active");
    });
});

function resetData() {
    const confirm = window.confirm("Are you sure you want to reset the data?");
    if (!confirm) return;
    localStorage.clear();
    location.reload();
}

// Utility to create an element with optional HTML content
function createElement(tag, html = "", className = "") {
    const el = document.createElement(tag);
    el.innerHTML = html;
    if (className) el.className = className;
    return el;
}

document.getElementById("editSaveToggle").addEventListener("click", () => {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    const editBtn = document.getElementById('editSaveToggle');
    if (editBtn.textContent === "Edit") {
        emailInput.disabled = false;
        phoneInput.disabled = false;
        dateInput.disabled = false;
        editBtn.textContent = "Save";
    } else {
        emailInput.disabled = true;
        phoneInput.disabled = true;
        dateInput.disabled = true;
        editBtn.textContent = "Edit";
    }
});

function initContactForm(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    const messageDiv = document.getElementById('form-message');

    messageDiv.textContent = ""; // Reset message

    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const date = dateInput.value;

    let isValid = true;

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            messageDiv.textContent = "Please enter a valid email address.";
        } else if (!/^\d+$/.test(phone)) {
            isValid = false;
            messageDiv.textContent = "Phone number must contain only digits.";
        } else if (!date) {
            isValid = false;
            messageDiv.textContent = "Please select a valid date.";
        }

        if (isValid) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "Form submitted successfully!";
            userData.contact[0].text = email;
            userData.contact[1].text = phone;
            userData.contact[2].text = date;
            localStorage.setItem("userData", JSON.stringify(userData));
            console.warn('success')
            location.reload();
        } else {
            messageDiv.style.color = "red";
        }
}


function renderCV(data) {
    // Name and title
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("title").textContent = data.title;

    // Contact
    // const contactList = document.getElementById("contact-list");
    // data.contact.forEach(item => {
    //     const div = createElement("div", `<img src="photos/${item.icon}" class="icon" alt="">${item.text}`, "contact-item");
    //     contactList.appendChild(div);
    // });

    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const date = document.getElementById("date");

    email.value = data.contact[0].text;
    phone.value = data.contact[1].text;
    date.value = data.contact[2].text;

    // Social Media
    const socialList = document.getElementById("social-list");
    userData.socialMedia.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "social-item";
    
        div.innerHTML = `
            <img src="photos/${item.icon}" class="icon" alt="">
            <span id="social-text-${index}">${item.text}</span>
            <button id="edit-btn-${index}">Edit</button>
        `;
    
        // Attach the click event properly
        div.querySelector(`#edit-btn-${index}`).addEventListener("click", () => {
            editSocialItem(index);
        });
    
        socialList.appendChild(div);
    });
    
    function editSocialItem(index) {
        const newText = prompt("Enter new text:");
        if (newText && newText.trim() !== "") {
            const span = document.getElementById(`social-text-${index}`);
            span.textContent = newText;
            userData.socialMedia[index].text = newText;
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    }

    // Education
    const eduList = document.getElementById("education-list");
    data.education.forEach(item => {
        const li = createElement("li", `<strong>${item.period}:</strong> ${item.school}`);
        eduList.appendChild(li);
    });

    // Skills
    const skillList = document.getElementById("skills-list");
    const addskillBtn = document.createElement("button");
    addskillBtn.textContent = "Add Skill";
    addskillBtn.id = "add-skill-btn";
    skillList.appendChild(addskillBtn);
    addskillBtn.addEventListener("click", () => {
        const skillInput = prompt("Enter a skill:");
        if (skillInput) {
            const li = createElement("li", skillInput);
            skillList.appendChild(li);
            data.skills.push(skillInput);
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    });
    userData.skills.forEach(skill => {
        const li = createElement("li", skill);
        skillList.appendChild(li);
    });

    // Languages
    const langList = document.getElementById("languages-list");
    const addlangBtn = document.createElement("button");
    addlangBtn.textContent = "Add Language";
    addlangBtn.id = "add-lang-btn";
    langList.appendChild(addlangBtn);
    addlangBtn.addEventListener("click", () => {
        const langInput = prompt("Enter a language:");
        if (langInput) {
            const li = createElement("li", langInput);
            langList.appendChild(li);
            data.languages.push(langInput);
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    });
    userData.languages.forEach(lang => {
        const li = createElement("li", lang);
        langList.appendChild(li);
    });

    // Profile
    document.getElementById("profile-text").innerHTML = data.profile + "<button id='edit-profile-btn'>Edit</button>";
    document.getElementById("edit-profile-btn").addEventListener("click", () => {
        const newProfile = prompt("Enter new profile:", data.profile);
        if (newProfile) {
            document.getElementById("profile-text").textContent = newProfile;
            userData.profile = newProfile;
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    });

    // Work Experience
    const workList = document.getElementById("work-list");
    data.workExperience.forEach(job => {
        const jobDiv = createElement("div");
        const title = createElement("h3", job.title);
        const ul = createElement("ul");
        job.details.forEach(detail => {
            ul.appendChild(createElement("li", detail));
        });
        jobDiv.appendChild(title);
        jobDiv.appendChild(ul);
        workList.appendChild(jobDiv);
    });

    // Certifications
    const certList = document.getElementById("certifications-list");
    userData.certifications.forEach(cert => {
        const certDiv = createElement("div");
        const title = createElement("h3", cert.name);
        const desc = createElement("p", cert.description);
        certDiv.appendChild(title);
        certDiv.appendChild(desc);
        certList.appendChild(certDiv);
    });

    // Projects
    const projList = document.getElementById("projects-list");
    data.projects.forEach(project => {
        const projDiv = createElement("div");
        const title = createElement("h3", project.name);
        const desc = createElement("p", project.description);
        projDiv.appendChild(title);
        projDiv.appendChild(desc);
        projList.appendChild(projDiv);
    });

    // Reference
    document.getElementById("reference-text").innerHTML = userData.reference + "<button id='edit-reference-btn'>Edit</button>";
    document.getElementById("edit-reference-btn").addEventListener("click", () => {
        const newReference = prompt("Enter new reference:", userData.reference);
        if (newReference) {
            document.getElementById("reference-text").textContent = newReference;
            userData.reference = newReference;
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    });
}

// Run after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    renderCV(userData);
});
