import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CameraView as Camera, CameraType, CameraProps } from "expo-camera";

interface CameraWrapperProps extends CameraProps {
  facing?: CameraType;
  active?: boolean;
}

const CameraWrapper = forwardRef<any, CameraWrapperProps>(
  ({ facing = "back", style, ...props }, ref) => {
    const internalRef = useRef<Camera>(null);

    // Expose the Camera API methods to the parent
    useImperativeHandle(ref, () => ({
      takePictureAsync: (options: any) =>
        internalRef.current?.takePictureAsync(options),
      recordAsync: (options: any) => internalRef.current?.recordAsync(options),
      pausePreview: () => internalRef.current?.pausePreview(),
      resumePreview: () => internalRef.current?.resumePreview(),
      getSupportedRatios: () => internalRef.current?.getSupportedRatios(),
      // Add more Camera methods here if needed
    }));

    return <Camera ref={internalRef} style={style} type={facing} {...props} />;
  }
);

export default CameraWrapper;
