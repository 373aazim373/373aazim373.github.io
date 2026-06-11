import React, { useEffect, useState } from 'react';
import { 
  Gamepad2, 
  Radar, 
  Route, 
  Cpu, 
  Zap, 
  Github, 
  ExternalLink,
  ChevronRight,
  CircuitBoard,
  Battery,
  Gauge
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { heroData, modesData, technicalSpecs, galleryImages, projectInfo } from '../data/mock';

const iconMap = {
  gamepad: Gamepad2,
  radar: Radar,
  route: Route
};

const Home = () => {
  const [activeMode, setActiveMode] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircuitBoard className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                TriModeCar
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('specs')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                Specs
              </button>
              <button onClick={() => scrollToSection('gallery')} className="text-gray-300 hover:text-cyan-400 transition-colors">
                Gallery
              </button>
              <a href={projectInfo.github} className="text-gray-300 hover:text-cyan-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Neon glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className={`container mx-auto max-w-6xl relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center space-y-8">
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 text-sm px-4 py-1">
              Arduino-Powered Innovation
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                {heroData.title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
              {heroData.subtitle}
            </p>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {heroData.description}
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                onClick={() => scrollToSection('features')} 
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-semibold px-8 py-6 text-lg group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              >
                {heroData.ctaText}
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:border-cyan-400"
                onClick={() => window.open(projectInfo.github, '_blank')}
              >
                <Github className="w-5 h-5 mr-2" />
                View Code
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              {heroData.stats.map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features/Modes Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Three Modes, <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Infinite Possibilities</span>
            </h2>
            <p className="text-gray-400 text-lg">Switch seamlessly between manual control, autonomous navigation, and precision tracking</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modesData.map((mode, index) => {
              const Icon = iconMap[mode.icon];
              return (
                <Card 
                  key={mode.id} 
                  className={`bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer group hover:scale-105 ${activeMode === index ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : ''}`}
                  onMouseEnter={() => setActiveMode(index)}
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">{mode.name}</CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {mode.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mode.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section id="specs" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Technical</span> Specifications
            </h2>
            <p className="text-gray-400 text-lg">Powered by Arduino and precision-engineered components</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Microcontroller */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-white">Microcontroller</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Model:</span>
                  <span className="text-white font-semibold">{technicalSpecs.microcontroller.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Specs:</span>
                  <span className="text-gray-300 text-sm">{technicalSpecs.microcontroller.specs}</span>
                </div>
              </CardContent>
            </Card>

            {/* Motors */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Gauge className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-white">Motors & Driver</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white font-semibold">{technicalSpecs.motors.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver:</span>
                  <span className="text-gray-300">{technicalSpecs.motors.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voltage:</span>
                  <span className="text-gray-300">{technicalSpecs.motors.voltage}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sensors */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Radar className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-white">Sensors & Modules</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {technicalSpecs.sensors.map((sensor, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <div className="text-white font-semibold mb-1">{sensor.name}</div>
                      <div className="text-cyan-400 text-sm mb-2">{sensor.model}</div>
                      <div className="text-gray-400 text-xs">{sensor.purpose}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Power */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Battery className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-white">Power System</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Battery:</span>
                  <span className="text-white font-semibold">{technicalSpecs.power.battery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Runtime:</span>
                  <span className="text-gray-300">{technicalSpecs.power.runtime}</span>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-white">Physical Specs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimensions:</span>
                  <span className="text-white font-semibold">{technicalSpecs.dimensions.length} × {technicalSpecs.dimensions.width}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-gray-300">{technicalSpecs.dimensions.weight}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Project <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Gallery</span>
            </h2>
            <p className="text-gray-400 text-lg">Behind the scenes of building the TriModeCar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer aspect-video"
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                  <p className="text-gray-300 text-sm">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-cyan-500/10" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Card className="bg-black/60 backdrop-blur-xl border-cyan-500/30">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Interested in the <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Code</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore the complete source code, circuit diagrams, and documentation on GitHub. Contributions and feedback welcome!
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                  onClick={() => window.open(projectInfo.github, '_blank')}
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
                <Button 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                  onClick={() => window.open(projectInfo.documentation, '_blank')}
                >
                  Documentation
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <CircuitBoard className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                TriModeCar
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 {projectInfo.developer}. Arduino-Powered Innovation.
            </p>
            <div className="flex items-center gap-6">
              <a href={projectInfo.github} className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={projectInfo.documentation} className="text-gray-400 hover:text-cyan-400 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;