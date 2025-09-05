const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            About <span className="portfolio-text-gradient">Me</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I'm a passionate developer with expertise in modern web technologies. 
                I love creating beautiful, functional applications that solve real-world problems 
                and provide exceptional user experiences.
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With a strong foundation in both frontend and backend development, 
                I bring ideas to life through clean, efficient code and thoughtful design.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">Frontend</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>React & TypeScript</li>
                    <li>Next.js</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">Backend</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Node.js</li>
                    <li>Python</li>
                    <li>PostgreSQL</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl card-gradient shadow-card p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">JD</span>
                  </div>
                  <p className="text-muted-foreground">Profile image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;