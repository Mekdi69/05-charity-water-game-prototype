// This array stores the 3 decision stages for the game.
// Each stage has a title, a prompt, choices, and a short learning message.
const gameStages = [
	{
		stageTitle: 'Stage 1: Fundraising',
		scenario: 'Your college volunteer club has one month and a small budget to raise support for a village water well project.',
		prompt: 'Which fundraising approach is most effective and responsible?',
		choices: [
			{
				text: 'Plan a large party, spend most of the budget on decorations, and share very little project information',
				points: -3,
				goodChoice: false,
				message: 'This is a weak strategy. High event costs and low transparency reduce trust and limit long-term support for clean water projects.'
			},
			{
				text: 'Run a low-cost campus campaign with clear impact facts, student stories, and regular donation updates',
				points: 5,
				goodChoice: true,
				message: 'Great decision. This combines fundraising with education and transparency, which usually leads to stronger and more sustainable support.'
			},
			{
				text: 'Post one generic donation link and stop communication after launch day',
				points: -1,
				goodChoice: false,
				message: 'This has limited impact. Without ongoing communication, many supporters do not understand where money goes or why the project matters.'
			}
		]
	},
	{
		stageTitle: 'Stage 2: Choosing a Well Site',
		scenario: 'Your team can support one village this year. Engineers shared site notes on water need, flood risk, and road access.',
		prompt: 'Which site is the safest and most practical choice?',
		choices: [
			{
				text: 'Village A: easy delivery route, but most households already have nearby safe water',
				points: 0,
				goodChoice: false,
				message: 'Not the strongest choice. Logistics are good, but need is lower, so this does not maximize impact for limited resources.'
			},
			{
				text: 'Village B: high need, stable ground, low flood risk, and a local water committee ready to help',
				points: 5,
				goodChoice: true,
				message: 'Excellent site selection. It balances urgent need, engineering safety, and local involvement, which improves reliability.'
			},
			{
				text: 'Village C: very high need but frequent flooding and no current local operations partner',
				points: -2,
				goodChoice: false,
				message: 'High need is important, but flood risk and missing local support create major failure risk without a stronger implementation plan.'
			}
		]
	},
	{
		stageTitle: 'Stage 3: Sustainable Build and Support',
		scenario: 'Funding is approved and the site is selected. Your final decision determines whether the well works for years or fails quickly.',
		prompt: 'Which implementation plan gives the best long-term sustainability?',
		choices: [
			{
				text: 'Finish construction quickly, then leave without local training, spare parts, or maintenance budget',
				points: -3,
				goodChoice: false,
				message: 'This is risky. A well can fail fast when no one is trained to repair pumps or manage maintenance costs.'
			},
			{
				text: 'Build with quality materials, train local technicians, test water quality, and set up a community maintenance fund',
				points: 5,
				goodChoice: true,
				message: 'Best choice. Long-term success depends on quality construction, local ownership, ongoing maintenance, and safe water monitoring.'
			},
			{
				text: 'Cut costs with cheaper materials and delay water quality testing until next year',
				points: -2,
				goodChoice: false,
				message: 'This saves money now but can create health and reliability problems later. Safe water projects require quality and monitoring.'
			}
		]
	}
];

// Grab elements from the page so we can update them during gameplay.
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const stageNumberEl = document.getElementById('stage-number');
const totalStagesEl = document.getElementById('total-stages');
const scoreEl = document.getElementById('score');
const progressBarEl = document.getElementById('progress-bar');
const stageLabelEl = document.getElementById('stage-label');
const scenarioTextEl = document.getElementById('scenario-text');
const questionTextEl = document.getElementById('question-text');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');

const endingTitleEl = document.getElementById('ending-title');
const endingMessageEl = document.getElementById('ending-message');
const finalScoreEl = document.getElementById('final-score');

// Game state values.
let currentStageIndex = 0;
let score = 0;
let hasAnsweredCurrentStage = false;

totalStagesEl.textContent = gameStages.length;

// Start the game from stage 1.
startBtn.addEventListener('click', () => {
	startScreen.hidden = true;
	endScreen.hidden = true;
	gameScreen.hidden = false;

	currentStageIndex = 0;
	score = 0;
	hasAnsweredCurrentStage = false;

	scoreEl.textContent = score;
	nextBtn.hidden = true;

	showStage();
});

// Move to the next stage, or finish the game.
nextBtn.addEventListener('click', () => {
	currentStageIndex += 1;
	hasAnsweredCurrentStage = false;
	nextBtn.hidden = true;

	if (currentStageIndex < gameStages.length) {
		showStage();
	} else {
		showEndingScreen();
	}
});

// Play again button starts a fresh run.
restartBtn.addEventListener('click', () => {
	startBtn.click();
});

// Render the current stage and its decision buttons.
function showStage() {
	const currentStage = gameStages[currentStageIndex];
	stageNumberEl.textContent = currentStageIndex + 1;
	stageLabelEl.textContent = currentStage.stageTitle;
	scenarioTextEl.textContent = currentStage.scenario;
	questionTextEl.textContent = currentStage.prompt;
	feedbackEl.textContent = 'Choose one option to continue your mission.';
	choicesEl.innerHTML = '';

	updateProgressBar();

	currentStage.choices.forEach((choice) => {
		const choiceButton = document.createElement('button');
		choiceButton.type = 'button';
		choiceButton.className = 'choice-btn';
		choiceButton.textContent = choice.text;

		choiceButton.addEventListener('click', () => {
			handleChoice(choice, choiceButton);
		});

		choicesEl.appendChild(choiceButton);
	});
}

// Process the selected choice, update score, and explain the result.
function handleChoice(choice, clickedButton) {
	if (hasAnsweredCurrentStage) {
		return;
	}

	hasAnsweredCurrentStage = true;
	score += choice.points;
	scoreEl.textContent = score;

	const allButtons = document.querySelectorAll('.choice-btn');
	allButtons.forEach((button) => {
		button.disabled = true;
	});

	if (choice.goodChoice) {
		clickedButton.classList.add('good');
	} else {
		clickedButton.classList.add('poor');
	}

	// Also highlight the strongest option for learning support.
	allButtons.forEach((button, index) => {
		if (gameStages[currentStageIndex].choices[index].goodChoice) {
			button.classList.add('good');
		}
	});

	const pointsText = choice.points >= 0 ? `+${choice.points}` : `${choice.points}`;
	feedbackEl.textContent = `${choice.message} (${pointsText} points)`;
	nextBtn.hidden = false;
}

// Update progress bar width based on current stage.
function updateProgressBar() {
	const progressPercent = ((currentStageIndex + 1) / gameStages.length) * 100;
	progressBarEl.style.width = `${progressPercent}%`;
}

// Show final outcome based on total score.
function showEndingScreen() {
	gameScreen.hidden = true;
	endScreen.hidden = false;
	finalScoreEl.textContent = score;

	if (score >= 10) {
		endingTitleEl.textContent = 'Success: Working Well Built!';
		endingMessageEl.textContent = 'Your team used smart planning, local involvement, and sustainable support. The village now has a reliable working well.';
	} else if (score >= 5) {
		endingTitleEl.textContent = 'Partial Success: Well Built with Risks';
		endingMessageEl.textContent = 'You made progress, but some decisions increased long-term risk. Strong projects need planning, local partnership, and sustainability.';
	} else {
		endingTitleEl.textContent = 'Mission Incomplete';
		endingMessageEl.textContent = 'The well plan was not sustainable enough. Try again and focus on practical decisions, community support, and long-term reliability.';
	}
}
