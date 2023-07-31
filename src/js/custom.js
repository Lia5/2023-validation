document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector(".form-file__input");
    const fileInputEmpty = document.querySelector(".form-file__empty");
    const fileInputFill = document.querySelector(".form-file__fill");
    const fileInputName = document.querySelector(".form-file__name");
    const fileInputSize = document.querySelector(".form-file__size");
    const fileInputClear = document.querySelector(".form-file__clear");
    const fileInputError = document.querySelector(".form-file__error");
    const stepNumber = document.querySelector(".form-section__label-number");
    const form = document.querySelector(".steps");
    const moveToStep = document.querySelectorAll(".move-to-step");
    const requiredInputs = document.querySelectorAll(".required");
    const phoneInput = document.querySelector(".form-line__input");

    const requiredFields = function  () {
        for(const input of requiredInputs) {
            if(input.value == "") {
                input.classList.add("show-error");
            } else {
                input.classList.remove("show-error");
            }
        }
        for(const input of requiredInputs) {
            if(input.classList.contains("show-error")) {
                return false;
            }
        }
        return true;
    }
    requiredInputs.forEach(input => {
        input.addEventListener("input", function(e) {
            if(this.value !== "") {
                input.classList.remove("show-error");
            }
        })
    })

    phoneInput.addEventListener("input", function(e) {
        const currentValue = this.value;
        const allowedValue = currentValue.replace(/[^0-9+]/g, "");
        if (allowedValue !== currentValue) {
            this.value = allowedValue;
        }
    });

    moveToStep.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            const nextStep = this.getAttribute("href").slice(1);
            const stepBody = document.getElementById(nextStep);
            switch(nextStep) {
                case "step1":
                    stepNumber.innerHTML = 1;
                    break;
                case "step2":
                    if(!requiredFields()) {
                        return;
                    };
                    stepNumber.innerHTML = 2;
                    break;
            }
            this.closest(".step").classList.add("hide");
            stepBody.classList.remove("hide");

        });
    });

    fileInput.addEventListener('change', updateFileInfo);

    function updateFileInfo() {
        const curFiles = fileInput.files;
        if (curFiles.length !== 0) {
            fileInputEmpty.classList.add("hide");
            fileInputFill.classList.remove("hide");
            fileInputName.innerHTML = fileInput.files[0].name;
            fileInputSize.innerHTML = (fileInput.files[0].size/1024).toFixed(1) + " kb";
        } else {
            fileInputEmpty.classList.remove("hide");
            fileInputFill.classList.add("hide");
        }
    }

    fileInputClear.addEventListener("click", () => {
        fileInput.value = '';
        fileInputEmpty.classList.remove("hide");
        fileInputFill.classList.add("hide");
        fileInputError.html = "";
        fileInputError.classList.add("hide");
    });

    const validateSizeFormat = function(input) {
        const file = input.files[0];
        const limit = 10000;
        const size = file.size/1024;
        const allowedFormats = /(\.doc|\.docx|\.rtf|\.txt)$/i;
        const name = input.value;
        if(size > limit) {
            fileInputError.innerHTML = `file too big: ${(size/1000).toFixed(2)} mb`;
            fileInputError.classList.remove("hide");
        } else if (!allowedFormats.exec(name)) {
            fileInputError.innerHTML = "Unknown file format. Please use .doc, .docx, .rtf, .txt files.";
            fileInputError.classList.remove("hide");
        } else {
            fileInputError.innerHTML = "";
            fileInputError.classList.add("hide");
            return true;
        }

    }

    function sendData() {
        const formElements = form.elements;
        console.log("formElements", formElements);
        const qaList = document.querySelectorAll('[name^="questions_"]');
        let labelValues = Array.from(qaList).map(item => {
          return item.closest(".form-line").querySelector(".form-line__label").textContent;
        });
        let fileInfoName = "",
            fileInfoFormat = "",
            fileInfoSize = "";
        if (formElements.file.files.length > 0) {
            const fileInfo = formElements.file.files[0];
            fileInfoName = fileInfo.name;
            fileInfoFormat = (fileInfo.name.match(/\.[0-9a-z]+$/i))[0].substr(1);
            fileInfoSize = fileInfo.size;
        }
        const formData = {
            "contactInfo" : {
                "phone": formElements.contactInfo_phone.value,
                "city": formElements.contactInfo_city.value,
                "country": formElements.contactInfo_country.value,
                "name": formElements.contactInfo_name.value
            },
            "questions" : [
                {
                    "question": labelValues[0],
                    "answer": formElements.questions_1.value
                },
                {
                    "question": labelValues[1],
                    "answer": formElements.questions_2.value
                },
                {
                    "question": labelValues[2],
                    "answer": formElements.questions_3.value
                },
                {
                    "question": labelValues[3],
                    "answer": formElements.questions_4.value
                },
                {
                    "question": labelValues[4],
                    "answer": formElements.questions_other.value
                }
            ],
            "file": {
                "name": fileInfoName,
                "format": fileInfoFormat,
                "size": fileInfoSize
            }
        }
        const jsonData = JSON.stringify(formData);

        fetch('https://my-json-server.typicode.com/Nezdara/form-fake-server/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Sending Error');
          }
          return response.json();
        })
        .then(data => {
          alert('Response: success ' + JSON.stringify(data));
        })
        .catch(error => {
          alert('Error message: ' + error.message);
        });
    }

    // uploadButton.addEventListener("click", () => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFileUploaded = fileInput.value;
        if(isFileUploaded != '') {
            if(validateSizeFormat(fileInput)) {
                sendData();
            }
        } else {
            sendData();
        }
    });
});