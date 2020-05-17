function slideBeforeRemoveFactory (duration = 200, delay = 0) {
    return element => $(element).delay(delay).slideUp(duration, () => $(element).remove());
}

function slideAfterAddFactory (duration = 200, delay = 0) {
    return element => $(element).hide().delay(delay).slideDown(duration);
}

function fadeBeforeRemoveFactory (duration = 200, delay = 0) {
    return element => $(element).delay(delay).fadeOut(duration, () => $(element).remove());
}

function fadeAfterAddFactory (duration = 200, delay = 0) {
    return element => $(element).hide().delay(delay).fadeIn(duration);
}

function templateIf (condition, data) {
    return condition ? [data] : undefined;
}
