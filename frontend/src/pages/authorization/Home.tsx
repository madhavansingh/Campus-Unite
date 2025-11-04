import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, Users, TrendingUp, Brain, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Home = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating geometric shapes (event-themed)
    const shapes = [];
    
    // Calendar/Date cards
    const cardGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.05);
    const cardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.7,
      shininess: 100
    });
    
    for (let i = 0; i < 8; i++) {
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      card.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      shapes.push({
        mesh: card,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: Math.random() * 0.002 + 0.001
      });
      scene.add(card);
    }

    // Torus (representing connections/networking)
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });
    
    for (let i = 0; i < 5; i++) {
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );
      shapes.push({
        mesh: torus,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.002 + 0.001
      });
      scene.add(torus);
    }

    // Icosahedrons (representing events/activities)
    const icoGeometry = new THREE.IcosahedronGeometry(0.3, 0);
    const icoMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7,
      flatShading: true
    });
    
    for (let i = 0; i < 6; i++) {
      const ico = new THREE.Mesh(icoGeometry, icoMaterial);
      ico.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      shapes.push({
        mesh: ico,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015
        },
        floatSpeed: Math.random() * 0.002 + 0.001
      });
      scene.add(ico);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x3b82f6, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Animate particles
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.03;
      
      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;
        
        // Floating animation
        shape.mesh.position.y += Math.sin(elapsedTime * shape.floatSpeed + index) * 0.001;
      });
      
      // Camera movement based on mouse
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)' }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-[120%] h-[120%] top-0 left-0 bg-gradient-to-r from-primary/20 via-blue-500/15 to-accent/20 opacity-50 blur-3xl" />
        <div className="absolute w-[100%] h-[100%] bottom-0 right-0 bg-gradient-to-br from-secondary/20 via-accent/15 to-primary/20 opacity-50 blur-2xl" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Event Discovery
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-white">Never Miss a</span>{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Campus Event
              </span>{" "}
              <span className="text-white">Again</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Campus Unite uses AI to recommend events tailored to your interests. 
              Discover workshops, hackathons and activities that matter to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary via-blue-500 to-primary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-transform shadow-lg backdrop-blur-sm"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-transform border-2 backdrop-blur-sm bg-background/50"
                onClick={() => navigate("/select-role")}
              >
                Explore Events
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Active Events", value: "50+", icon: Calendar },
              { label: "Colleges", value: "10K+", icon: Users },
              { label: "Accuracy", value: "95%", icon: TrendingUp },
              { label: "AI Matches", value: "5K+", icon: Brain },
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-card/80 backdrop-blur-md p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powered by AI</h2>
            <p className="text-xl text-muted-foreground">Smart features that learn from you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Personalized Feed",
                description: "AI learns your interests and recommends events you'll love",
                color: "text-primary"
              },
              {
                icon: Zap,
                title: "AI Recommendation Model",
                description: "Personalizes event discovery with intelligent insights",
                color: "text-accent"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Search Engine",
                description: "Smarter results. Faster discovery.",
                color: "text-primary"
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-card/80 backdrop-blur-md p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md rounded-3xl p-12 border shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students discovering events they love
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
