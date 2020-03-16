let ListPoint = [];
class Point{
	constructor(_x,_y){
		this._x = _x;
		this._y = _y;
	}
	DrawPoint(_2DContext){
		_2DContext.beginPath();
		_2DContext.arc(this._x, this._y, 5, 0, 2 * Math.PI);
		_2DContext.stroke();
	}
}
class PathTake{
	constructor(_ListPathTake,_howFar){
		this._ListPathTake = _ListPathTake;
		this._howFar = _howFar;
	}
	DrawLine(_2DContext){
		let lastPoint = this._ListPathTake[0];
		let PathsNoEnd = this._ListPathTake.slice(1,this._ListPathTake.length);
		PathsNoEnd.splice(PathsNoEnd.length,0,lastPoint);
		_2DContext.beginPath();
		PathsNoEnd.forEach(function(_point) {
			console.log(_point);
			_2DContext.moveTo(lastPoint._x, lastPoint._y);
			_2DContext.lineTo(_point._x, _point._y);
			lastPoint = _point;
			_2DContext.stroke();
		});
	}
}
function BruteForce(listPos){
	let startpoint = listPos.slice(0,1);
	let NotVisited = listPos.slice(1,listPos.length);
	console.log(NotVisited);
	return TryAllitem(0,startpoint,NotVisited);
	function TryAllitem(_howFar,_visited,_notVisited){
		if(_notVisited.length==0) return new PathTake(_visited,_howFar+TwoPointDist(_visited[0],_visited[_visited.length-1]));
		NodeNow = _visited[_visited.length-1];
		let ArrayPathCandidate = [];
		_notVisited.forEach(function(PathNow,indexPath){
			let FarPathNow = TwoPointDist(NodeNow,PathNow);
			let TempList = _visited.slice(0,_visited.length).concat([PathNow]);
			let NotVisited = _notVisited.slice(0,indexPath).concat(_notVisited.slice(indexPath+1,_notVisited.length));
			let PathCandidate = TryAllitem(_howFar+FarPathNow,TempList,NotVisited);
			AddSmallFirst(ArrayPathCandidate,PathCandidate);
		});
		//console.log({array:ArrayPathCandidate,visited:_visited,NotVisited:_notVisited});
		if(_notVisited.length==1) console.log({array:ArrayPathCandidate,visited:_visited,NotVisited:_notVisited});
		return ArrayPathCandidate[0];
	}
	function TwoPointDist(_NodeNow,_PathNow){
		let Width = Math.pow(Math.abs(_NodeNow._x-_PathNow._x),2);
		let Height = Math.pow(Math.abs(_NodeNow._y-_PathNow._y),2);
		let FarPathNow = Math.sqrt(Width+Height);
		return FarPathNow;
	}
	function AddSmallFirst(_list,_pathNow){
		let _indexPath = _list.findIndex(
			function(_ItemPath) { return _ItemPath._howFar>_pathNow._howFar}
		);
		_indexPath = _indexPath<0 ? _list.length : _indexPath;
		_list.splice(_indexPath,0,_pathNow);
	}
}
function SetMapCanvas(_Name) {
	canvas = document.getElementsByClassName(_Name)[0];
	ctx = canvas.getContext("2d");
	ListenEvent(canvas,"mousedown",SetPoint);
	let CalculateBtn = document.getElementById("CalculateBtn");
	CalculateBtn.onclick = function () {
		let pos = BruteForce(ListPoint);
		console.log(pos);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		pos.DrawLine(ctx);
		pos._ListPathTake.forEach(function(_point) {
			_point.DrawPoint(ctx);
		});
	}
}
function SetPoint(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	let NewPoint = new Point(x,y);
	ListPoint.push(NewPoint);
	NewPoint.DrawPoint(canvas.getContext("2d"));
}
function ListenEvent(_canvas,_eventName,_function){
	_canvas.addEventListener(_eventName, function(_eventdata){
		_function(_canvas,_eventdata);
	});
}
SetMapCanvas("MapCanvas");