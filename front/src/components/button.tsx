interface Prop extends React.ComponentProps<"button"> {
	children: React.ReactNode;
	handleClick?: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Button({children, handleClick, ...rest}:Prop) {
	return(<button onClick={handleClick} {...rest}>{children}</button>)
}
