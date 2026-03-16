// Each stage has a title, a short mission context, and action cards.
// Every action changes one or more resources.
const missionStages = [
	{
		label: 'Stage 1: Fundraising',
		title: 'How will your team raise support?',
		description: 'You need funds and momentum. Choose one strategy for your first month of outreach.',
		visual: {
			icon: '💵',
			title: 'Fundraising Picture',
			description: 'Donation jar filling up with money as students support clean water.'
		},
		actions: [
			{
				name: 'Campus Fundraiser Event',
				details: 'Host a student event with clear project storytelling and donation stations.',
				effects: { budget: 20, time: -10, energy: -8, trust: 12 },
				feedback: 'Strong event turnout boosts funds and trust, but your team gets tired and loses time.'
			},
			{
				name: 'Social Media Campaign',
				details: 'Run short videos, impact posts, and donation updates for four weeks.',
				effects: { budget: 12, time: -6, energy: -5, trust: 8 },
				feedback: 'Digital storytelling helps both fundraising and awareness with moderate effort.'
			},
			{
				name: 'Club Partnership Drive',
				details: 'Partner with three campus clubs to share volunteer workload and outreach.',
				effects: { budget: 15, time: -8, energy: 6, trust: 10 },
				feedback: 'Teamwork improves reach and keeps energy steadier because responsibilities are shared.'
			}
		]
	},
	{
		label: 'Stage 2: Site Selection',
		title: 'Which village site will you support?',
		description: 'Balance need, safety, and cost. Choosing the wrong site can hurt long-term outcomes.',
		visual: {
			icon: '🗺️',
			title: 'Village Map Picture',
			description: 'Map pins highlight village options while your team studies safe terrain.'
		},
		actions: [
			{
				name: 'Village A (Low Cost, Lower Need)',
				details: 'Road access is easy and drilling cost is low, but current water need is moderate.',
				effects: { budget: -10, time: -4, energy: -3, trust: 2 },
				feedback: 'This is affordable, but impact is smaller because water access is already somewhat stable.'
			},
			{
				name: 'Village B (Balanced Choice)',
				details: 'High need, safer terrain, and local committee support for maintenance.',
				effects: { budget: -14, time: -6, energy: -4, trust: 14 },
				feedback: 'Balanced planning improves trust and creates a strong foundation for sustainability.'
			},
			{
				name: 'Village C (High Need, High Risk)',
				details: 'Need is very high, but flood risk and transport costs are also high.',
				effects: { budget: -20, time: -12, energy: -10, trust: 6 },
				feedback: 'Need is urgent, but high risk drains resources quickly and adds implementation stress.'
			}
		]
	},
	{
		label: 'Stage 3: Build Plan',
		title: 'How will you spend your build budget?',
		description: 'Pick one project plan for drilling, materials, sanitation, and training.',
		visual: {
			icon: '🏗️',
			title: 'Construction Picture',
			description: 'A well is under construction with tools, drilling, and volunteer teamwork.'
		},
		actions: [
			{
				name: 'Fast Build, Minimal Training',
				details: 'Prioritize speed and skip technician training to save money.',
				effects: { budget: -8, time: 4, energy: -2, trust: -18 },
				feedback: 'Quick results look good at first, but missing training can reduce long-term well reliability.'
			},
			{
				name: 'Balanced Sustainable Build',
				details: 'Invest in quality drilling, sanitation, and local maintenance training.',
				effects: { budget: -18, time: -8, energy: -6, trust: 20 },
				feedback: 'This plan is resource-heavy now, but it strongly increases long-term success.'
			},
			{
				name: 'Low-Cost Materials Plan',
				details: 'Use cheaper materials and delay some sanitation steps.',
				effects: { budget: -5, time: -3, energy: 2, trust: -14 },
				feedback: 'Money and energy are saved now, but trust drops because reliability and safety are weaker.'
			}
		]
	}
];

// Starting resource values.
const initialResources = {
	budget: 60,
	time: 70,
	energy: 65,
	trust: 55
};

// Page references.
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');

const stageCounterEl = document.getElementById('stage-counter');
const difficultyLabelEl = document.getElementById('difficulty-label');
const trackerLineEl = document.getElementById('tracker-line');
const trackerSteps = document.querySelectorAll('.tracker-step');

const budgetValueEl = document.getElementById('budget-value');
const timeValueEl = document.getElementById('time-value');
const energyValueEl = document.getElementById('energy-value');
const trustValueEl = document.getElementById('trust-value');

const budgetBarEl = document.getElementById('budget-bar');
const timeBarEl = document.getElementById('time-bar');
const energyBarEl = document.getElementById('energy-bar');
const trustBarEl = document.getElementById('trust-bar');

const stageLabelEl = document.getElementById('stage-label');
const stageTitleEl = document.getElementById('stage-title');
const stageDescriptionEl = document.getElementById('stage-description');
const stageVisualEl = document.getElementById('stage-visual');
const actionsEl = document.getElementById('actions');
const feedbackEl = document.getElementById('feedback');

const endingTitleEl = document.getElementById('ending-title');
const endingMessageEl = document.getElementById('ending-message');
const endingStatsEl = document.getElementById('ending-stats');
const endingVisualEl = document.getElementById('ending-visual');

// Game state.
let resources = { ...initialResources };
let currentStageIndex = 0;
let hasChosenAction = false;
let missionEndedEarly = false;
let selectedDifficulty = 'normal';

startBtn.addEventListener('click', startMission);
nextBtn.addEventListener('click', goToNextStage);
restartBtn.addEventListener('click', startMission);

// Reset values and open the mission dashboard.
function startMission() {
	selectedDifficulty = getSelectedDifficulty();
	difficultyLabelEl.textContent = `Difficulty: ${formatDifficulty(selectedDifficulty)}`;
	difficultyLabelEl.classList.remove('easy', 'normal', 'hard');
	difficultyLabelEl.classList.add(selectedDifficulty);
	resources = { ...initialResources };
	currentStageIndex = 0;
	hasChosenAction = false;
	missionEndedEarly = false;

	startScreen.hidden = true;
	endScreen.hidden = true;
	gameScreen.hidden = false;
	nextBtn.hidden = true;

	feedbackEl.textContent = 'Choose one action to continue your mission.';
	updateResourceUI();
	renderStage();
}

// Render stage content. Stage 4 is the outcome summary stage.
function renderStage() {
	if (currentStageIndex >= missionStages.length) {
		renderOutcomeStage();
		return;
	}

	const stage = missionStages[currentStageIndex];
	hasChosenAction = false;
	nextBtn.hidden = true;

	stageCounterEl.textContent = `Stage ${currentStageIndex + 1} of 4`;
	stageLabelEl.textContent = stage.label;
	stageTitleEl.textContent = stage.title;
	stageDescriptionEl.textContent = stage.description;
	setStageVisual(stage.visual);
	feedbackEl.textContent = 'Pick one action card. Each choice changes your resources.';

	actionsEl.innerHTML = '';
	stage.actions.forEach((action) => {
		const actionBtn = document.createElement('button');
		actionBtn.type = 'button';
		actionBtn.className = 'action-btn';
		actionBtn.innerHTML = `<strong>${action.name}</strong><span>${action.details}</span>`;

		actionBtn.addEventListener('click', () => {
			handleActionChoice(action, actionBtn);
		});

		actionsEl.appendChild(actionBtn);
	});

	updateProgressTracker();
}

// Apply resource changes and show immediate feedback.
function handleActionChoice(action, selectedButton) {
	if (hasChosenAction) {
		return;
	}

	hasChosenAction = true;
	const adjustedEffects = getAdjustedEffects(action.effects);
	applyEffects(adjustedEffects);
	updateResourceUI();

	const allActionButtons = document.querySelectorAll('.action-btn');
	allActionButtons.forEach((button) => {
		button.disabled = true;
	});
	selectedButton.classList.add('selected');

	feedbackEl.textContent = `${action.feedback} ${buildEffectText(adjustedEffects)}`;

	if (isMissionCollapsed()) {
		missionEndedEarly = true;
		showFinalScreen();
		return;
	}

	nextBtn.textContent = currentStageIndex === missionStages.length - 1 ? 'View Outcome Stage' : 'Next Stage';
	nextBtn.hidden = false;
}

// Move to the next stage.
function goToNextStage() {
	currentStageIndex += 1;
	renderStage();
}

// Show stage 4 summary before the final ending screen.
function renderOutcomeStage() {
	stageCounterEl.textContent = 'Stage 4 of 4';
	stageLabelEl.textContent = 'Stage 4: Outcome';
	stageTitleEl.textContent = 'Mission outcome based on your resource balance';
	setStageVisual({
		icon: '🚰',
		title: 'Finished Well Picture',
		description: 'The completed water well is ready to provide clean water to the village.'
	});

	const status = evaluateMissionStatus();
	stageDescriptionEl.textContent = status.description;
	actionsEl.innerHTML = '';
	feedbackEl.textContent = 'You can review your mission result, then open the final report.';

	nextBtn.textContent = 'Open Final Report';
	nextBtn.hidden = false;
	nextBtn.onclick = showFinalScreen;

	updateProgressTracker();
}

// Final ending screen with replay button.
function showFinalScreen() {
	const status = evaluateMissionStatus();

	gameScreen.hidden = true;
	endScreen.hidden = false;
	nextBtn.onclick = goToNextStage;

	endingTitleEl.textContent = status.title;
	endingMessageEl.textContent = status.description;
	endingVisualEl.innerHTML = `
		<div class="stage-icon" aria-hidden="true">🚰</div>
		<div>
			<h4>Finished Water Well Picture</h4>
			<p>The project goal is a safe, working well that the community can maintain.</p>
		</div>
	`;
	endingStatsEl.innerHTML = `
		<li>Budget remaining: ${resources.budget}</li>
		<li>Time remaining: ${resources.time}</li>
		<li>Team energy: ${resources.energy}</li>
		<li>Community trust: ${resources.trust}</li>
	`;
}

// Show a visual card for each stage so students can see the mission story.
function setStageVisual(visual) {
	stageVisualEl.innerHTML = `
		<div class="stage-icon" aria-hidden="true">${visual.icon}</div>
		<div>
			<h4>${visual.title}</h4>
			<p>${visual.description}</p>
		</div>
	`;
}

// Convert effects object into readable text.
function buildEffectText(effects) {
	const keys = ['budget', 'time', 'energy', 'trust'];
	const labels = {
		budget: 'Budget',
		time: 'Time',
		energy: 'Energy',
		trust: 'Trust'
	};

	const parts = keys.map((key) => {
		const amount = effects[key];
		const prefix = amount >= 0 ? '+' : '';
		return `${labels[key]} ${prefix}${amount}`;
	});

	return `Resource changes: ${parts.join(', ')}.`;
}

function getSelectedDifficulty() {
	let choice = 'normal';

	difficultyInputs.forEach((input) => {
		if (input.checked) {
			choice = input.value;
		}
	});

	return choice;
}

function formatDifficulty(value) {
	if (value === 'easy') {
		return 'Easy';
	}

	if (value === 'hard') {
		return 'Hard';
	}

	return 'Normal';
}

function getAdjustedEffects(baseEffects) {
	const adjusted = {};
	const keys = ['budget', 'time', 'energy', 'trust'];

	keys.forEach((key) => {
		const value = baseEffects[key];
		adjusted[key] = scaleByDifficulty(value);
	});

	return adjusted;
}

function scaleByDifficulty(value) {
	if (selectedDifficulty === 'normal') {
		return value;
	}

	if (selectedDifficulty === 'easy') {
		if (value > 0) {
			return Math.round(value * 1.2);
		}

		if (value < 0) {
			return Math.round(value * 0.8);
		}

		return 0;
	}

	if (value > 0) {
		return Math.round(value * 0.8);
	}

	if (value < 0) {
		return Math.round(value * 1.2);
	}

	return 0;
}

// Keep values between 0 and 100 so bars stay valid.
function applyEffects(effects) {
	resources.budget = clampValue(resources.budget + effects.budget);
	resources.time = clampValue(resources.time + effects.time);
	resources.energy = clampValue(resources.energy + effects.energy);
	resources.trust = clampValue(resources.trust + effects.trust);
}

function clampValue(value) {
	if (value < 0) {
		return 0;
	}

	if (value > 100) {
		return 100;
	}

	return value;
}

// Update number counters and animated bar widths.
function updateResourceUI() {
	budgetValueEl.textContent = resources.budget;
	timeValueEl.textContent = resources.time;
	energyValueEl.textContent = resources.energy;
	trustValueEl.textContent = resources.trust;

	budgetBarEl.style.width = `${resources.budget}%`;
	timeBarEl.style.width = `${resources.time}%`;
	energyBarEl.style.width = `${resources.energy}%`;
	trustBarEl.style.width = `${resources.trust}%`;
}

// Update progress tracker circles and line fill.
function updateProgressTracker() {
	trackerSteps.forEach((step, index) => {
		step.classList.remove('done', 'active');

		if (index < currentStageIndex) {
			step.classList.add('done');
		} else if (index === currentStageIndex) {
			step.classList.add('active');
		}
	});

	const linePercent = (currentStageIndex / 3) * 100;
	trackerLineEl.style.background = `linear-gradient(to right, #4FCB53 ${linePercent}%, #eaf2fb ${linePercent}%)`;
}

// If any key resource hits zero, the mission cannot continue safely.
function isMissionCollapsed() {
	return resources.budget === 0 || resources.time === 0 || resources.energy === 0 || resources.trust === 0;
}

// Decide mission result from final resource values.
function evaluateMissionStatus() {
	const total = resources.budget + resources.time + resources.energy + resources.trust;

	if (missionEndedEarly || total < 160 || resources.trust < 35) {
		return {
			title: 'Mission Failed: Project Not Sustainable',
			description: 'The project ran out of critical support before long-term stability was secured. Replay and protect trust, time, and team energy.'
		};
	}

	if (total < 240 || resources.trust < 55) {
		return {
			title: 'Partial Success: Well Built with Risks',
			description: 'A well was built, but weaker resource balance may cause future maintenance challenges. Better planning can improve reliability.'
		};
	}

	return {
		title: 'Sustainable Success: Reliable Water Access',
		description: 'Your decisions balanced budget, time, energy, and trust. The village has a stronger chance of long-term clean water access.'
	};
}
