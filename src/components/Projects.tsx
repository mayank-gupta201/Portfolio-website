import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Upload, Plus } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectForm } from "@/components/forms/ProjectForm";

const Projects = () => {
  const { user } = useAuth();
  const { data: projects = [], isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading projects:', error);
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My <span className="portfolio-text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Here are some of my featured projects that showcase my skills and passion for development.
          </p>
          
          {/* Add new project button - only show to authenticated users */}
          {user && (
            <ProjectForm />
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border-0">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={project.image_url || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.github_url && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="glass-effect"
                      onClick={() => window.open(project.github_url!, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="glass-effect"
                      onClick={() => window.open(project.demo_url!, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add project card - only show to authenticated users */}
          {user && (
            <Card className="group border-2 border-dashed border-muted hover:border-brand-primary transition-colors duration-300 cursor-pointer">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
                <Upload className="w-12 h-12 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Project</h3>
                <p className="text-muted-foreground text-sm">
                  Click to add a new project to your portfolio
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;