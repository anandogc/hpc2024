
function initializeTagInput(container, tag_input, selected_values_input) {
    const tagContainer = document.getElementById(container);
    const tagInput = document.getElementById(tag_input);
    const selectedValuesInput = document.getElementById(selected_values_input)

    let selectedValues = [];

    function createTag(label) {
        const div = document.createElement('div');
        div.setAttribute('class', 'tag');
        const span = document.createElement('span');
        span.innerHTML = label;
        const closeBtn = document.createElement('span');
        closeBtn.setAttribute('class', 'remove-tag');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            tagContainer.removeChild(div);
            removeValue(label);
            //
        });
        div.appendChild(span);
        div.appendChild(closeBtn);
        return div;
    }

    function addTag(label) {
        if (!selectedValues.includes(label)) {
            const tag = createTag(label);
            tagContainer.insertBefore(tag, tagInput);
            selectedValues.push(label);
            selectedValuesInput.value = selectedValues.join(', ');

            if (selectedValuesInput.value !== '')
                tagContainer.classList.remove('b--dark-red')
        }
    }

    function removeValue(label) {
        selectedValues = selectedValues.filter(value => value !== label);
    }

    tagInput.addEventListener('change', function() {
        if (tagInput.value !== '') {
            addTag(tagInput.value);
            tagInput.value = '';
        }
    });

    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && tagInput.value !== '') {
            e.preventDefault();
            addTag(tagInput.value);
            tagInput.value = '';
        }
    });

    tagContainer.addEventListener('click', function() {
        tagInput.focus();
    });

    // selectedValuesButton.addEventListener('click', function() {
    //     
    // });
}