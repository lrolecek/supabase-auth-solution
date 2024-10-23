export function EmptyComponent() {
	return (
		<div style={{border: '5px solid blue', margin: '1em', padding: '1em'}}>
			<p>Component</p>
			<h2>value</h2>
			<button onClick={() => {}}>Button</button>
		</div>
	);
}

export default EmptyComponent;