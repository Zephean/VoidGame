//Which switch is it?
var swapSwitch : boolean;
var moveSwitch : boolean;
var addSwitch : boolean;

//For Swap: Voids being swapped
//For Add: Voids before and after where the void is being inserted
var void1 : GameObject;
var void2 : GameObject;

//Variables for the Move Switch
private var originalVoidPosition : Vector3;
private var original : boolean;
var newVoidPosition : Vector3;
var voidBeingMoved : GameObject;

//Variables for the Add Switch
var voidBeingAdded : GameObject;

//Variables for the Robot Switch
var robotSwitch : boolean;
var robot : GameObject;

//Buffer to prevent spacebar spam
private var buffer : float;

//On/off textures
var onTexture: Texture2D;
var offTexture: Texture2D;

function Start () {	
	buffer=Time.time;
	if(moveSwitch) {
		originalVoidPosition = voidBeingMoved.GetComponent(Transform).position;
		original = true;
	}
	
	//If robots are active, swap the textures
	var par = transform.parent.gameObject;
	if(robotSwitch) {
		if(robot.GetComponent(AnthroBot)) {
			if(!robot.GetComponent(AnthroBot).isLockingDoor)
				par.renderer.material.mainTexture = onTexture;
		}
		else if(robot.GetComponent(RoombaBot)) {
			if(robot.GetComponent(RoombaBot).isSuckingVoids)
				par.renderer.material.mainTexture = onTexture;
		}
	}
}

/*
When the player hits space, activate whichever behavior belongs to that switch
*/
function OnTriggerStay(other : Collider) {
	if(Input.GetKey("space") && (Time.time - buffer > 1)){
		if(swapSwitch)
			VoidSwap();
		if(moveSwitch)
			VoidMove();
		if(addSwitch)
			VoidAdd();
		if(robotSwitch)
			RobotSwitch();
		buffer=Time.time;
		if(transform.parent.renderer.material.mainTexture == onTexture)
			transform.parent.renderer.material.mainTexture = offTexture;
		else
			transform.parent.renderer.material.mainTexture = onTexture;
	}
}

/*
Switch that swaps the positions of two voids
*/
function VoidSwap() {
	var temp = void1.GetComponent(Transform).position;
	void1.GetComponent(Transform).position=void2.GetComponent(Transform).position;
	void2.GetComponent(Transform).position=temp;
}

/*
Switch that moves a void from position A to B
*/
function VoidMove() {
	if(original)
		voidBeingMoved.GetComponent(Transform).position = newVoidPosition;
	else 
		voidBeingMoved.GetComponent(Transform).position = originalVoidPosition;
	original = !original;
}

/*
Switch that adds a "dead" void to the loop
*/
function VoidAdd() {
	void1.GetComponent(Voids).connectedVoid = voidBeingAdded;
	voidBeingAdded.GetComponent(Voids).connectedVoid = void2;
	voidBeingAdded.GetComponent(Voids).playerAvatar = void1.GetComponent(Voids).playerAvatar;
	voidBeingAdded.renderer.material.color = Color.white;
}

/*
Switch that swaps the robot's routine
*/
function RobotSwitch() {
	robot.GetComponent(AnthroBot).Swap();
}