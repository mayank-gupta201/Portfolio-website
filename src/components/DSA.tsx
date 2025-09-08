import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Clock, Trophy, Plus, Upload, ExternalLink } from "lucide-react";
import { useDSAProblems } from '@/hooks/useDSAProblems';
import { useAuth } from '@/contexts/AuthContext';
import DSAForm from '@/components/forms/DSAForm';

const DSA = () => {
  const { data: problems, isLoading, error } = useDSAProblems();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (error) {
    return (
      <section id="dsa" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-500">Error loading DSA problems</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dsa" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Data Structures & <span className="portfolio-text-gradient">Algorithms</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Showcasing my problem-solving skills with data structures and algorithms across various platforms.
          </p>
          
          {user && (
            <Button 
              onClick={() => setShowForm(true)}
              className="hero-gradient text-white shadow-card hover:shadow-hover transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Solution
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems?.map((problem) => (
              <Card key={problem.id} className="group hover:shadow-hover transition-all duration-300 border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{problem.title}</h3>
                        {problem.problem_url && (
                          <a
                            href={problem.problem_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{problem.platform}</p>
                    </div>
                    {problem.solved && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs border ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {problem.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Time:</span>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {problem.time_complexity}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Space:</span>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {problem.space_complexity}
                        </code>
                      </div>
                    </div>

                    {problem.solution_url && (
                      <div className="pt-2">
                        <a
                          href={problem.solution_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View Solution <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {problem.notes && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground italic">
                          {problem.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add solution card */}
            {user && (
              <Card 
                className="group border-2 border-dashed border-muted hover:border-brand-primary transition-colors duration-300 cursor-pointer"
                onClick={() => setShowForm(true)}
              >
                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                  <Upload className="w-12 h-12 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Add Solution</h3>
                  <p className="text-muted-foreground text-sm">
                    Upload your algorithm solutions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DSAForm open={showForm} onOpenChange={setShowForm} />
      </div>
    </section>
  );
};

export default DSA;