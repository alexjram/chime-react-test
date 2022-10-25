

export default function htmlLogger(message) {
    const loggerUl = document.querySelector('#logger > ul');

    const li = document.createElement('li');

    li.innerHTML = message;

    //loggerUl.appendChild(li);
}