import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Edit2, Save, X, Plus } from 'lucide-react';

const About = () => {
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkills, setEditingSkills] = useState<{
    frontend: string[];
    backend: string[];
  }>({ frontend: [], backend: [] });
  const [newSkill, setNewSkill] = useState({ frontend: '', backend: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        await uploadAvatar(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleEditSkills = () => {
    setEditingSkills({
      frontend: profile?.frontend_skills || ['React & TypeScript', 'Next.js', 'Tailwind CSS'],
      backend: profile?.backend_skills || ['Node.js', 'Python', 'PostgreSQL'],
    });
    setIsEditing(true);
  };

  const handleSaveSkills = async () => {
    if (user) {
      try {
        await updateProfile({
          frontend_skills: editingSkills.frontend,
          backend_skills: editingSkills.backend,
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save skills:', error);
      }
    }
  };

  const addSkill = (type: 'frontend' | 'backend') => {
    const skill = newSkill[type].trim();
    if (skill) {
      setEditingSkills(prev => ({
        ...prev,
        [type]: [...prev[type], skill]
      }));
      setNewSkill(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeSkill = (type: 'frontend' | 'backend', index: number) => {
    setEditingSkills(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const displayName = profile?.display_name || "Mayank Gupta";
  const frontendSkills = profile?.frontend_skills?.length ? profile.frontend_skills : ['React & TypeScript', 'Next.js', 'Tailwind CSS'];
  const backendSkills = profile?.backend_skills?.length ? profile.backend_skills : ['Node.js', 'Python', 'PostgreSQL'];

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
                {profile?.bio || "I'm a passionate developer with expertise in modern web technologies. I love creating beautiful, functional applications that solve real-world problems and provide exceptional user experiences."}
              </p>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With a strong foundation in both frontend and backend development, 
                I bring ideas to life through clean, efficient code and thoughtful design.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-brand-primary">Frontend</h3>
                    {user && !isEditing && (
                      <Button size="sm" variant="ghost" onClick={handleEditSkills}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editingSkills.frontend.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {skill}
                            <X 
                              className="w-3 h-3 ml-1 cursor-pointer" 
                              onClick={() => removeSkill('frontend', index)}
                            />
                          </Badge>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add skill"
                          value={newSkill.frontend}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, frontend: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill('frontend')}
                        />
                        <Button size="sm" onClick={() => addSkill('frontend')}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-1 text-muted-foreground">
                      {frontendSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-brand-primary">Backend</h3>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editingSkills.backend.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {skill}
                            <X 
                              className="w-3 h-3 ml-1 cursor-pointer" 
                              onClick={() => removeSkill('backend', index)}
                            />
                          </Badge>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add skill"
                          value={newSkill.backend}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, backend: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill('backend')}
                        />
                        <Button size="sm" onClick={() => addSkill('backend')}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-1 text-muted-foreground">
                      {backendSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveSkills} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Card className="shadow-card border-0">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="relative inline-block">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={displayName}
                          className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {displayName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      {user && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute -bottom-1 -right-1 rounded-full w-10 h-10 p-0"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{displayName}</h3>
                    <p className="text-muted-foreground">
                      {profile?.location || "Gwalior, M.P., India"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;