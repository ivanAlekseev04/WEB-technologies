document.addEventListener('DOMContentLoaded', function () {
    const info = document.getElementById('info');
    const floatingWindow = document.getElementById('floatingWindow');
    const closeBtn = document.getElementById('closeBtn');

    info.addEventListener('click', function () {
        floatingWindow.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        floatingWindow.style.display = 'none';
    });

    // Close the floating window when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target == floatingWindow) {
            floatingWindow.style.display = 'none';
        }
    });
});

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => {
            // Handle the error and set isValidCss to false
            reject(new Error("Error reading CSS file"));
        };

        reader.readAsText(file);
    });
}

function validateCSSContent(cssContent) {
    const errors = validateCSS(cssContent);
    
    if (errors.length !== 0) {
        addMessage({"success": false, "message": "Invalid CSS file: must follow given template"});
        return errors;
    } else {
        addMessage({"success": true, "message": "Valid CSS file"});
        return [];
    }
}

let form = document.getElementById("designForm");
form.addEventListener('submit', async (action) => {
    action.preventDefault();

    const fileInput = document.getElementById('css');
    let errors = [];

    if(fileInput.files.length == 1) {
        const file = fileInput.files[0];

        if (file && file.type === "text/css") {
            try {
                const cssContent = await readFileAsText(file);
                errors = validateCSSContent(cssContent);
            } catch (error) {
                addMessage({"success": false, "message": error.message});
            }
        }
    } else {
        addMessage({"success": false, "message": "Invalid CSS file"});
    }

    //Terminate flow if there were errors
    if(errors.length != 0) {
        return;
    }

    let formData = new FormData();

    if(document.getElementById('image').files.length == 1) {
        formData.append('image', document.getElementById('image').files[0]);
    } 
    if(document.getElementById('css').files.length == 1) {
        formData.append('css', document.getElementById('css').files[0]);
    }

    fetch('../../Backend/API/UploadCssImage.php', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if(!res.ok) {
            return res.json().then(errorData => {
                throw new Error(errorData.message || 'Unknown error occurred');
            });
        }

        form.reset();
        return res.json();
    })
    .then(data => {
        addMessage(data);

        document.getElementById('image').value = '';
        document.getElementById('css').value = '';
    })
    .catch(err => {
        addMessage(err);
    });
})

function validateCSS(content) {
    const errors = [];
    const requiredRules = {
        ".card": ["background-color", "border-radius", "font-weight", "color", "font-size"],
        ".card-header": ["background-color", "color", "font-style", "font-weight"]
    };

    const lines = content.split('\n');
    let currentSelector = null;
    let properties = [];
    let insideRule = false;
    let ruleBuffer = "";

    lines.forEach((line, index) => {
        line = line.trim();

        // Skip empty lines and comments
        if (line === '' || line.startsWith('/*') || line.startsWith('*') || line.startsWith('*/')) {
            return;
        }

        // Append to buffer if inside a rule
        if (insideRule) {
            ruleBuffer += " " + line;

            // Check for closing brace
            if (line.includes('}')) {
                const ruleMatch = ruleBuffer.match(/^(\.[\w\-]+)\s*\{([^}]*)\}\s*$/);
                if (ruleMatch) {
                    currentSelector = ruleMatch[1];
                    const propertyBlock = ruleMatch[2].trim();
                    properties = propertyBlock.split(';').map(p => p.split(':')[0].trim()).filter(Boolean);
                    validateRule(currentSelector, properties, requiredRules, errors);
                } else {
                    errors.push(`Syntax error at line ${index + 1}: ${line}`);
                }

                insideRule = false;
                ruleBuffer = "";
            }
            return;
        }

        // Check for selectors
        const selectorMatch = line.match(/^(\.[\w\-]+)\s*\{$/);
        if (selectorMatch) {
            currentSelector = selectorMatch[1];
            properties = [];
            insideRule = true;
            ruleBuffer = line;
            return;
        }

        // If none of the above, it's an error
        errors.push(`Syntax error at line ${index + 1}: ${line}`);
    });

    // Validate the last rule if any
    if (insideRule) {
        const ruleMatch = ruleBuffer.match(/^(\.[\w\-]+)\s*\{([^}]*)\}\s*$/);
        if (ruleMatch) {
            currentSelector = ruleMatch[1];
            const propertyBlock = ruleMatch[2].trim();
            properties = propertyBlock.split(';').map(p => p.split(':')[0].trim()).filter(Boolean);
            validateRule(currentSelector, properties, requiredRules, errors);
        } else {
            errors.push(`Syntax error: incomplete rule`);
        }
    }

    // Check for any missing required rules
    Object.keys(requiredRules).forEach(selector => {
        if (!requiredRules[selector].checked) {
            errors.push(`Missing required rule: ${selector}`);
        }
    });

    return errors;
}

function validateRule(selector, properties, requiredRules, errors) {
    if (!requiredRules[selector]) {
        errors.push(`Unexpected rule: ${selector}`);
        return;
    }

    const requiredProperties = requiredRules[selector];
    requiredProperties.checked = true;

    requiredProperties.forEach(prop => {
        if (!properties.includes(prop)) {
            errors.push(`Missing property '${prop}' in rule ${selector}`);
        }
    });

    properties.forEach(prop => {
        if (!requiredProperties.includes(prop)) {
            errors.push(`Unexpected property '${prop}' in rule ${selector}`);
        }
    });
}

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('designForm');
    const msg = document.getElementById('message');

    if(msg) {
        if(message.success) {
            //msgDiv.className ='success';
            msg.className = 'success';
    
            msg.textContent = message.message;
        } else {
            msg.className = 'error';
    
            // Add the error message text
            msg.textContent = message.message;
        }

        return;
    }

    // Create a new div element
    const msgDiv = document.createElement('div');

    // Set its class to 'error' or 'success'
    if(message.success) {
        //msgDiv.className ='success';
        msgDiv.className = 'success';

        msgDiv.textContent = message.message;
    } else {
        msgDiv.className = 'error';

        // Add the error message text
        msgDiv.textContent = message.message;
    }

    msgDiv.id = "message";
    // Append the error div to the end of the form
    form.appendChild(msgDiv);
}