import gameOfLife from './gameOfLife';

(function(){
    const body = document.querySelector('body');
    const canvas = document.createElement('canvas');
    const seedRange = document.createElement('input');
    seedRange.type = 'range';
    const speedRange = document.createElement('input');
    speedRange.type = 'range';
    const controls = {
        canvas,
        seedRange,
        speedRange,
    };

    const mainContainer = document.createElement('div');
    mainContainer.style = 'display: flex; flex-direction: column; width: 100%; text-align: center;'

    Object.entries(controls).forEach(([title, element]) => {
        const container = document.createElement('div');
        container.style = 'margin: 10px;'
        const label = document.createElement('label');
        label.style = 'display: block;'
        label.textContent = title;

        container.appendChild(label);
        container.appendChild(element);
        mainContainer.appendChild(container);
    })

    document.body.appendChild(mainContainer);

    gameOfLife(controls);
})()