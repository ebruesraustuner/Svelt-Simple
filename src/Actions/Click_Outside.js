export function clickOutside(node) {
	const handleClick = (event) => {
        if(!node.contains(event.target)) {
            node.dispatchEvent(new CustomEvent("outClick"))
        }
    }

    document.addEventListener("click", handleClick, false)


	return {
		destroy() {
			// ...cleanup 
            document.removeEventListener("click", handleClick, true)
		}
	};
}
