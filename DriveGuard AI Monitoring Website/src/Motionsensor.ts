let motionEnabled = false;

let motionData = {
  x: 0,
  y: 0,
  z: 0,
};

function handleMotion(event: DeviceMotionEvent) {
  motionData = {
    x: event.accelerationIncludingGravity?.x ?? 0,
    y: event.accelerationIncludingGravity?.y ?? 0,
    z: event.accelerationIncludingGravity?.z ?? 0,
  };
}

export async function enableMotionSensor() {
  try {
    const DeviceMotionEventClass =
      DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

    if (typeof DeviceMotionEventClass.requestPermission === "function") {
      const result = await DeviceMotionEventClass.requestPermission();

      if (result !== "granted") {
        return false;
      }
    }

    if (!motionEnabled) {
      window.addEventListener("devicemotion", handleMotion);
      motionEnabled = true;
    }

    return true;
  } catch (error) {
    console.error("Motion sensor error:", error);
    return false;
  }
}

export function getMotionData() {
  return motionData;
}

export function getAccelerationMagnitude() {
  const { x, y, z } = motionData;

  return Math.sqrt(x * x + y * y + z * z);
}

export function isMotionSensorEnabled() {
  return motionEnabled;
}