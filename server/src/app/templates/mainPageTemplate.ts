const versionBase = 2
const versionPostfix = 8

export const MAIN_PAGE_TEMPLATE = `
	<style>
		.root {
			opacity: .6;
		} 
		.dash {
			color: yellowgreen;
			opacity: .8;
		}
		div {
		    margin: 0;
			display: flex;
			flex-direction: column;
			gap: .4rem;
		}
		a {
			text-decoration: none;
			color: white;
			transition: .1s ease-in;
		}
		a:hover {
			color: yellowgreen;
			opacity: .8;
		}
		body {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: black;
			height: 100%;
			overflow: hidden;
			margin: 2rem;
			color: white;
			font: calc(1vw + 1vh) Inconsolata, monospace;
			text-shadow: 0 0 5px #C8C8C8;
        }
		body::after {
		    z-index: -1;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            pointer-events: none;
		}
	</style>
	<div>
		<span>
			<span class="root">@root</span> <span class="dash">~</span> v.${versionBase}.${versionPostfix}&nbsp;&nbsp;&nbsp;<span>${new Date().getFullYear()}.${new Date().getMonth() + 1 <= 9 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}.${new Date().getDate() <= 9 ? `0${new Date().getDate()}` : new Date().getDate()}</span>
		</span>
		<span>
			<span class="root">@root</span> <span class="dash">~</span> by&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://artandfact.ru/">art&fact</a>                                               										
		</span>
	</div>
`
