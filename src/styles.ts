import { css } from 'lit';

export const formStyle = css`
	label {
		display: block;
		width: 100%;
		color: #999;
	}

	label input {
		display: block;
		margin-top: 4px;
	}

	input:not([type='button']):not([type='submit']) {
		font-family: var(--font-family);
		padding: 0;
		margin: 0;
		border: 0;
		background: transparent;
		color: #e9e8e7;
		width: 100%;
		font-size: 11pt;
		resize: none;
		outline: none;
		background: #090807;
		border: 1px solid #454443;
		padding: 0 0 0 10px;
		box-sizing: border-box;
	}

	/* From .newbutton */
	input[type='button'],
	input[type='submit'],
	button {
		display: inline-block;
		padding: 1px 10px;
		line-height: 24px;
		white-space: nowrap;
		background: #222324;
		color: #fff;
		margin: 1px 0;
		border: none;
	}

	input[type='button']:not([disabled]):hover,
	input[type='submit']:not([disabled]):hover,
	button:not([disabled]):hover {
		background: #565758;
		cursor: pointer;
	}

	.centered-button {
		text-align: center;
		margin-top: 7px;
	}
`;
