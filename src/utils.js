/**
 * Extends the default configuration options with the instance options.
 *
 * @param {Object} destination The default configuration options.
 * @param {Object} source The instance options.
 *
 * @return {Object} The merged configuration options.
 */
export function _extend(destination, source) {
    let newDestination = destination;

    if (destination === null) newDestination = {};

    [].slice.call(Object.keys(source)).forEach((key) => {
        newDestination[key] = source[key];
    });

    return destination;
}

/**
 * Creates and dispatches a new custom event on a specified element.
 *
 * @param {Element|String} element A DOM element, the event target. Or the event
 *     name in which case the target will be a Window.
 * @param {String|Object} name The event name.
 * @param {Object} params Optional parameters that allow for sending custom data
 *     through the event.
 *
 * @return {void}
 */
export function _dispatch(element, name, params) {
    let newElement = element;
    let newName = name;
    let newParams = params;

    if (typeof element === 'string') {
        newParams = name;
        newName = element;
        newElement = window;
    }

    newParams = newParams || {};
    newElement.dispatchEvent(
        new CustomEvent(newName, {
            detail: newParams,
            bubbles: true,
            cancelable: true,
        })
    );
}
