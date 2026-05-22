import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  PointLight,
  DirectionalLight,
  Shape,
  Path,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Mesh,
  Group,
  BoxGeometry,
  DoubleSide,
} from 'three';

@Component({
  selector: 'app-devsock-logo',
  imports: [],
  templateUrl: './devsock-logo.html',
  styleUrl: './devsock-logo.css',
})
export class DevsockLogo implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    this.initScene();
  }

   @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private animationId!: number;
  private group!: Group;
  private glitchMeshCyan!: Mesh;
  private glitchMeshPink!: Mesh;
  private lights: { light: PointLight; type: string }[] = [];
  private decorSquares: Mesh[] = [];
  private mouse = { x: 0, y: 0 };
  private glitchTimer = 0;
  private isGlitching = false;

  ngOnInit(): void {
    this.initScene();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;

    this.renderer = new WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.shadowMap.enabled = true;

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(45, W / H, 0.1, 100);
    this.camera.position.set(0, 0.5, 7);

    this.setupLights();
    this.buildLogo();
    this.setupEvents();
    this.animate(0);
  }

  private setupLights(): void {
    this.scene.add(new AmbientLight(0xffffff, 0.3));

    const cyan = new PointLight(0x00ffff, 3, 20);
    cyan.position.set(-3, 3, 4);
    this.scene.add(cyan);
    this.lights.push({ light: cyan, type: 'cyan' });

    const pink = new PointLight(0xff0066, 3, 20);
    pink.position.set(3, -1, 4);
    this.scene.add(pink);
    this.lights.push({ light: pink, type: 'pink' });

    const dir = new DirectionalLight(0xffffff, 6);
    dir.position.set(0, 5, 5);
    dir.castShadow = true;
    this.scene.add(dir);
  }

  private makeD(color: number, opacity = 1): Mesh {
    const shape = new Shape();
    const W = 1.6,
      H = 2.4;

    shape.moveTo(0, 0);
    shape.lineTo(0, H);
    shape.lineTo(W * 0.5, H);
    shape.quadraticCurveTo(W + 0.25, H, W + 0.25, H * 0.5);
    shape.quadraticCurveTo(W + 0.25, 0, W * 0.5, 0);
    shape.closePath();

    const hole = new Path();
    const t = 0.32;
    hole.moveTo(t, t);
    hole.lineTo(t, H - t * 2 + t);
    hole.lineTo(W * 0.4 + t * 0.5, H - t * 2 + t);
    hole.quadraticCurveTo(W + t * 0.5 - t, H - t * 2 + t, W + t * 0.5 - t, H * 0.5);
    hole.quadraticCurveTo(W + t * 0.5 - t, t, W * 0.4 + t * 0.5, t);
    hole.closePath();
    shape.holes.push(hole);

    const geo = new ExtrudeGeometry(shape, {
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 4,
    });
    geo.center();

    const mat = new MeshStandardMaterial({
      color,
      metalness: 0.6,
      roughness: 0.2,
      transparent: opacity < 1,
      opacity,
      side: DoubleSide,
    });

    return new Mesh(geo, mat);
  }

  private buildLogo(): void {
    this.group = new Group();

    const dMain = this.makeD(0xffffff);
    dMain.castShadow = true;
    this.group.add(dMain);

    this.glitchMeshCyan = this.makeD(0x00e5ff, 0.7);
    this.glitchMeshCyan.position.set(-0.07, 0.04, -0.15);
    this.group.add(this.glitchMeshCyan);

    this.glitchMeshPink = this.makeD(0xff0055, 0.6);
    this.glitchMeshPink.position.set(0.07, -0.04, -0.25);
    this.group.add(this.glitchMeshPink);

    const squareData: { pos: [number, number, number]; color: number; size: number }[] = [
      { pos: [1.1, -1.0, 0.1], color: 0x00e5ff, size: 0.15, },
      { pos: [1.6, -0.3, -0.1], color: 0xff0055, size: 0.17 },
      { pos: [1.4, 0.8, 0.05], color: 0xffffff, size: 0.12 },
    ];

    squareData.forEach((d) => {
      const sq = new Mesh(
        new BoxGeometry(d.size, d.size, d.size * 0.7),
        new MeshStandardMaterial({ color: d.color, metalness: 0.8, roughness: 0.1 }),
      );
      sq.position.set(...d.pos);
      this.group.add(sq);
      this.decorSquares.push(sq);
    });

    this.scene.add(this.group);
  }


  private setupEvents(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    });
    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H);
  };

  private animate = (t: number): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const time = t * 0.001;

    this.group.rotation.y += (this.mouse.x * 0.5 - this.group.rotation.y) * 0.05;
    this.group.rotation.x += (this.mouse.y * 0.2 - this.group.rotation.x) * 0.05;
    this.group.rotation.y += Math.sin(time * 0.4) * 0.003;
    this.group.position.y = Math.sin(time * 0.7) * 0.1;

    this.lights.forEach(({ light, type }) => {
      if (type === 'cyan') {
        light.position.x = Math.sin(time * 0.8) * 4;
        light.position.y = Math.cos(time * 0.6) * 2 + 2;
      } else {
        light.position.x = Math.cos(time * 0.9) * 4;
        light.position.y = Math.sin(time * 0.7) * 2 - 1;
      }
    });

    this.glitchTimer += 0.016;
    if (!this.isGlitching && Math.random() < 0.005) {
      this.isGlitching = true;
      this.glitchTimer = 0;
    }
    if (this.isGlitching) {
      const gx = (Math.random() - 0.5) * 0.25;
      const gy = (Math.random() - 0.5) * 0.1;
      this.glitchMeshCyan.position.set(-0.07 + gx, 0.04 + gy, -0.15);
      this.glitchMeshPink.position.set(0.07 - gx * 0.7, -0.04 - gy * 0.5, -0.25);
      if (this.glitchTimer > 0.12) {
        this.isGlitching = false;
        this.glitchMeshCyan.position.set(-0.07, 0.04, -0.15);
        this.glitchMeshPink.position.set(0.07, -0.04, -0.25);
      }
    }

    this.decorSquares.forEach((sq, i) => {
      sq.rotation.y = time * (1.2 + i * 0.3);
      sq.rotation.x = time * (0.7 + i * 0.2);
    });

    this.renderer.render(this.scene, this.camera);
  };
}
