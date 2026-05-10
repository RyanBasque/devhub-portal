"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Globe() {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.002 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.cursor = "grab";
    container.appendChild(canvas);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      console.error("WebGL not supported");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3.5;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a2e,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(sphere);

    const innerGeometry = new THREE.SphereGeometry(0.98, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a0a0f,
      transparent: true,
      opacity: 0.9,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    globeGroup.add(innerSphere);

    const numPoints = 40;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }

    const dotGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.8,
    });

    points.forEach((point) => {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial.clone());
      dot.position.copy(point.clone().multiplyScalar(1.01));
      globeGroup.add(dot);

      const glowGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(point.clone().multiplyScalar(1.01));
      globeGroup.add(glow);
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = points[i].distanceTo(points[j]);
        if (distance < 0.6) {
          const curve = new THREE.QuadraticBezierCurve3(
            points[i].clone().multiplyScalar(1.01),
            points[i]
              .clone()
              .add(points[j])
              .multiplyScalar(0.5)
              .normalize()
              .multiplyScalar(1.15),
            points[j].clone().multiplyScalar(1.01)
          );
          const curvePoints = curve.getPoints(20);
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
          const line = new THREE.Line(lineGeometry, lineMaterial.clone());
          globeGroup.add(line);
        }
      }
    }

    const updateSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;
      rotationVelocityRef.current.x = deltaY * 0.005;
      rotationVelocityRef.current.y = deltaX * 0.005;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const handleTouchStart = (e) => {
      isDraggingRef.current = true;
      previousMouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.touches[0].clientX - previousMouseRef.current.x;
      const deltaY = e.touches[0].clientY - previousMouseRef.current.y;
      rotationVelocityRef.current.x = deltaY * 0.005;
      rotationVelocityRef.current.y = deltaX * 0.005;
      previousMouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      globeGroup.rotation.y += rotationVelocityRef.current.y;
      globeGroup.rotation.x += rotationVelocityRef.current.x;

      if (!isDraggingRef.current) {
        rotationVelocityRef.current.y *= 0.98;
        rotationVelocityRef.current.x *= 0.98;
        if (Math.abs(rotationVelocityRef.current.y) < 0.001) {
          rotationVelocityRef.current.y = 0.002;
        }
      }

      globeGroup.children.forEach((child, index) => {
        if (child.geometry && child.geometry.type === "SphereGeometry") {
          if (child.material.opacity < 0.3) {
            child.material.opacity =
              0.15 + Math.sin(Date.now() * 0.003 + index) * 0.05;
          } else {
            child.material.opacity =
              0.7 + Math.sin(Date.now() * 0.003 + index) * 0.1;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
