function convertAmericanToDecimal(americanOdds) {
    if (americanOdds > 0) {
        return 1 + (americanOdds / 100);
    } else {
        return 1 + (100 / Math.abs(americanOdds));
    }
}

function triggerRefreshAnimation() {
    const bet1Element = document.getElementById('bet1');
    const bet2Element = document.getElementById('bet2');
    bet1Element.style.animation = 'none';
    bet2Element.style.animation = 'none';
    // Trigger reflow to restart the animation
    bet1Element.offsetHeight;
    bet2Element.offsetHeight;
    bet1Element.style.animation = '';
    bet2Element.style.animation = '';
}

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === '1') {
        const bet1 = document.getElementById('bet1').textContent;
        if (bet1) {
            navigator.clipboard.writeText(bet1).then(() => {
                alert('Bet Size 1 copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }
    if (event.ctrlKey && event.key === '2') {
        const bet2 = document.getElementById('bet2').textContent;
        if (bet2) {
            navigator.clipboard.writeText(bet2).then(() => {
                alert('Bet Size 2 copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }
});

document.getElementById('odds1').addEventListener('keydown', function (event) {
    if (event.key === 'Tab' && !event.shiftKey && this.value !== '') {
        event.preventDefault(); // Prevent default tab behavior
        document.getElementById('odds2').focus();
    }
});

document.getElementById('odds2').addEventListener('keydown', function (event) {
    if (event.key === 'Tab' && !event.shiftKey) {
        recalculate();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const odds1Element = document.getElementById('odds1');
    const odds2Element = document.getElementById('odds2');
    const weightedElement = document.getElementById('weighted');
    const roundWagersElement = document.getElementById('roundWagers');

    if (odds1Element) {
        const odds1Value = localStorage.getItem('odds1Value');
        if (odds1Value !== null) {
            odds1Element.value = odds1Value;
        }
        odds1Element.focus();
    }

    if (odds2Element) {
        const odds2Value = localStorage.getItem('odds2Value');
        if (odds2Value !== null) {
            odds2Element.value = odds2Value;
        }
    }

    if (weightedElement) {
        const weightedPreference = localStorage.getItem('weightedPreference');
        if (weightedPreference !== null) {
            weightedElement.checked = JSON.parse(weightedPreference);
        }
    }

    if (roundWagersElement) {
        const roundWagersPreference = localStorage.getItem('roundWagersPreference');
        if (roundWagersPreference !== null) {
            roundWagersElement.checked = JSON.parse(roundWagersPreference);
        }
    }

    const bet1Element = document.getElementById('bet1');
    const bet2Element = document.getElementById('bet2');
    if (bet1Element) {
        const bet1Value = localStorage.getItem('bet1Value');
        if (bet1Value !== null) {
            bet1Element.textContent = bet1Value;
        }
    }

    if (bet2Element) {
        const bet2Value = localStorage.getItem('bet2Value');
        if (bet2Value !== null) {
            bet2Element.textContent = bet2Value;
        }
    }

    const profit1Element = document.getElementById('profit1');
    const profit2Element = document.getElementById('profit2');
    if (profit1Element) {
        const profit1Value = localStorage.getItem('profit1Value');
        if (profit1Value !== null) {
            profit1Element.textContent = profit1Value;
        }
    }

    if (profit2Element) {
        const profit2Value = localStorage.getItem('profit2Value');
        if (profit2Value !== null) {
            profit2Element.textContent = profit2Value;
        }
    }

    const totalInvestmentElement = document.getElementById('totalInvestment');
    if (totalInvestmentElement) {
        const totalInvestmentValue = localStorage.getItem('totalInvestmentValue');
        if (totalInvestmentValue !== null) {
            totalInvestmentElement.value = totalInvestmentValue;
        }
    }
});

document.getElementById('weighted').addEventListener('change', function () {
    localStorage.setItem('weightedPreference', JSON.stringify(this.checked));
});

document.getElementById('odds1').addEventListener('input', function () {
    localStorage.setItem('odds1Value', this.value);
});
document.getElementById('odds2').addEventListener('input', function () {
    localStorage.setItem('odds2Value', this.value);
});

document.getElementById('totalInvestment').addEventListener('input', function () {
    localStorage.setItem('totalInvestmentValue', this.value);
});

document.getElementById('roundWagers').addEventListener('change', function () {
    localStorage.setItem('roundWagersPreference', JSON.stringify(this.checked));
});

const odds1Element = document.getElementById('odds1');
const odds2Element = document.getElementById('odds2');

if (odds1Element) {
    odds1Element.addEventListener('focus', function () {
        this.select();
    });
}

if (odds2Element) {
    odds2Element.addEventListener('focus', function () {
        this.select();
    });
}

// Remove other recalculation triggers
document.getElementById('odds2').removeEventListener('input', recalculate);
document.getElementById('odds2').removeEventListener('focus', recalculate);

function recalculate() {
    const odds1 = convertAmericanToDecimal(parseFloat(document.getElementById('odds1').value));
    const odds2 = convertAmericanToDecimal(parseFloat(document.getElementById('odds2').value));
    const isWeighted = document.getElementById('weighted').checked;
    const roundWagers = document.getElementById('roundWagers').checked;
    const totalInvestment = parseFloat(document.getElementById('totalInvestment').value);

    if (isNaN(odds1) || odds1 <= 0) {
        alert('Please enter a valid value for Odds 1 greater than 0.');
        return;
    }

    let bet1, bet2;

    if (isWeighted) {
        // Weighted strategy: Break even on odds1
        bet1 = totalInvestment / odds1;
        bet2 = totalInvestment - bet1;
    } else {
        // Regular arbitrage strategy
        bet1 = totalInvestment / (1 + (odds1 / odds2));
        bet2 = totalInvestment - bet1;
    }

    if (roundWagers) {
        // Round wagers to the nearest 10
        bet1 = Math.round(bet1 / 10) * 10;
        bet2 = Math.round(bet2 / 10) * 10;
    }

    document.getElementById('bet1').textContent = bet1.toFixed(2);
    document.getElementById('bet2').textContent = bet2.toFixed(2);

    // Calculate and display profit for each outcome
    const profit1 = (bet1 * odds1) - totalInvestment;
    const profit2 = (bet2 * odds2) - totalInvestment;
    document.getElementById('profit1').textContent = profit1.toFixed(2);
    document.getElementById('profit2').textContent = profit2.toFixed(2);

    // Save data to local storage
    localStorage.setItem('bet1Value', bet1.toFixed(2));
    localStorage.setItem('bet2Value', bet2.toFixed(2));
    localStorage.setItem('profit1Value', profit1.toFixed(2));
    localStorage.setItem('profit2Value', profit2.toFixed(2));

    // Trigger refresh animation
    triggerRefreshAnimation();
}

