const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function mdm(d:Date) {
	const [dMonth, dDay, dHours, dMinutes] = [
		d.getMonth(),
		d.getDate(),
		("0" + d.getHours()).slice(-2),
		("0" + d.getMinutes()).slice(-2),
	];
	const dStr = `${monthNames[dMonth]}${dDay} ${dHours.toLocaleString()}:${dMinutes}`;
	return dStr;
}

export function ymdms(d:Date) {
	const [dYr, dMonth, dDay, dHours, dMinutes, dSeconds] = [
		d.getFullYear(),
		d.getMonth(),
		d.getDate(),
		("0" + d.getHours()).slice(-2),
		("0" + d.getMinutes()).slice(-2),
		("0" + d.getSeconds()).slice(-2)
	];
	const dStr = `${dYr}/${dMonth}/${dDay} ${dHours.toLocaleString()}:${dMinutes}.${dSeconds}`;
	return dStr;
}
