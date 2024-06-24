let prevRoute = "";

const routes = {
    "#/": { render: bio, onMount: (params) => {} },
    "#/404": { render: error404, onMount: (params) => {} },
    "#/feed": { render: feed, onMount: loadFeed },
    "#/wiki": { render: wiki, onMount: wikiOnMount  },
    "#/projects": { render: projects, onMount: loadProjects },
    "#/music": { render: music, onMount: (params) => { loadRecentObsessions(); loadMyMusic(); } }
};

window.onhashchange = (e) => { route(); };
window.addEventListener("DOMContentLoaded", e => { route(); });
window.onclick = (e) => {
    if(e.target.matches("[in-link]")) {
        e.preventDefault();
        document.getElementById(e.target.getAttribute("to")).scrollIntoView();
        return;
    }

    if(e.target.matches("#recent-obsessions img")) {
        return;
    }

    if(e.target.matches("#content img")) {
        const imageView = document.getElementById("image-view");
        const imageViewImage = document.getElementById("image-view-image");
        const imageViewClose = document.getElementById("close-image");

        const imageWidth = Math.min(e.target.naturalWidth, 600);
        const imageHeight = Math.min(imageWidth * e.target.naturalHeight / e.target.naturalWidth, window.innerHeight - 200);

        imageViewImage.setAttribute("src", e.target.getAttribute("src"));
        imageViewImage.setAttribute("width", imageWidth);

        imageView.style.display = "block";
        imageViewClose.style.transform = `translate(calc(-50% + ${imageWidth}px / 2), calc(-50% - ${imageHeight}px / 2))`;
    }
}

function navigate(hash, params) {
    let view = routes[hash];

    if(view) {
        document.getElementById("content").innerHTML = view.render();
        view.onMount(parseParams(params));
        recalculatePageResolution();
        prevRoute = hash;
        return;
    }

    if(hash) {
        navigate("#/404", null);
        return;
    }
    navigate("#/", null);
}

function parseParams(p) {
    if(!p)
        return null;

    const regex = /([^&=#]+)=([^&#]*)/g;
    const params = {};
    let match = null;

    while(match = regex.exec(p)) {
        params[match[1]] = match[2];
    }

    return params;
}

function route() {
    const splitByQuestion = window.location.hash.split("?");
    const split = splitByQuestion[0].split("/");
    const params = splitByQuestion[1];

    if(split.length == 0 || split.length == 1) {
        navigate(window.location.hash, params);
        return;
    }

    if(split.length >= 2) {
        navigate(`#/${split[1]}`, params);
        return;
    }
}

function pushNotification(text) {
    const notifications = document.getElementById("notifications");

    const newNotification = document.createElement("div");
    newNotification.classList.add("notification");
    newNotification.innerHTML = text;
    notifications.appendChild(newNotification);

    setTimeout(() => { 
        notifications.removeChild(newNotification);
    }, 1500);
}

function copyHandle() {
    navigator.clipboard.writeText("hamester");
    pushNotification("Handle copied to your clipboard!");
}

function toggleDarkMode() {
    if(localStorage.getItem("ham-bio-darkmode") == "false") {
        document.body.classList.add("dark");
        document.getElementById("theme-icon-sun").classList.add("theme-icon-visible");
        document.getElementById("theme-icon-moon").classList.remove("theme-icon-visible");
        localStorage.setItem("ham-bio-darkmode", "true");
    } else {
        document.body.classList.remove("dark");
        document.getElementById("theme-icon-moon").classList.add("theme-icon-visible");
        document.getElementById("theme-icon-sun").classList.remove("theme-icon-visible");
        localStorage.setItem("ham-bio-darkmode", "false");
    }
}

function initTheme() {
    if(localStorage.getItem("ham-bio-darkmode") === null) {
        localStorage.setItem("ham-bio-darkmode", matchMedia("(prefers-color-scheme: dark)").matches);
    }

    if(localStorage.getItem("ham-bio-darkmode") == "true") {
        document.body.classList.add("dark");
        document.getElementById("theme-icon-sun").classList.add("theme-icon-visible");
        return;
    }

    document.getElementById("theme-icon-moon").classList.add("theme-icon-visible");
}

function closeImageView() {
    const imageView = document.getElementById("image-view");
    imageView.style.display = "none";
}