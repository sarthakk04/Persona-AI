"use client";
import { useRef } from "react";
import VariableProximity from "./variableproximity";


export default function Home() {
  const containerRef = useRef(null); 

  return (

<div
ref={containerRef}
style={{position: 'relative'}}
>
  <VariableProximity
    label={'PERSONA'}
    className={'variable-proximity-demo'}
    fromFontVariationSettings="'wght' 400, 'opsz' 9"
    toFontVariationSettings="'wght' 1000, 'opsz' 40"
    containerRef={containerRef}
    radius={100}
    falloff='linear'
  />
</div>      
   

   
   

  );
}
