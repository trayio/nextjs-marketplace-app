export const openConfigWindow = (onFinish, onCancel) => {
    // Must open window from user interaction code otherwise it is likely
    // to be blocked by a popup blocker:
    const configWindow = window.open(
      undefined,
      '_blank',
      'width=500,height=500,scrollbars=no'
    );
  
    // Listen to popup messages
    let configFinished = false;
    const onmessage = (e) => {
      if (e.data.type === 'tray.configPopup.error') {
        // Handle popup error message
        alert(`Error: ${e.data.err}`);
      }
      if (e.data.type === 'tray.configPopup.cancel') {
        configWindow.close();
        onCancel && onCancel();
      }
      if (e.data.type === 'tray.configPopup.finish') {
        // Handle popup finish message
        configFinished = true;
        configWindow.close();
        onFinish && onFinish();
      }
      if (e.data.type === 'tray.configPopup.validate') {
        // Return validation in progress
        configWindow.postMessage(
          {
            type: 'tray.configPopup.client.validation',
            data: {
              inProgress: true,
            },
          },
          '*'
        );
  
        setTimeout(() => {
          // Add errors to all inputs
          const errors = e.data.data.visibleValues.reduce(
            (errors, externalId) => {
              console.log(
                `Visible ${externalId} value:`,
                e.data.data.configValues[externalId]
              );
              // Uncomment next line to set an error message
              // errors[externalId] = 'Custom error message';
              return errors;
            },
            {}
          );
  
          // Return validation
          configWindow.postMessage(
            {
              type: 'tray.configPopup.client.validation',
              data: {
                inProgress: false,
                errors: errors,
              },
            },
            '*'
          );
        }, 2000);
      }
    };
    window.addEventListener('message', onmessage);
  
    // Check if popup window has been closed before finishing the configuration.
    // We use a polling function due to the fact that some browsers may not
    // display prompts created in the beforeunload event handler.
    const CHECK_TIMEOUT = 1000;
    const checkWindow = () => {
      if (configWindow.closed) {
        window.removeEventListener('message', onmessage);
        !configFinished && onCancel && onCancel();
      } else {
        setTimeout(checkWindow, CHECK_TIMEOUT);
      }
    };
  
    checkWindow();
  
    return configWindow;
  };