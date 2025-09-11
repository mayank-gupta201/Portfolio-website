import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";
import { useCertificates } from "@/hooks/useCertificates";

const Certificates = () => {
  const { data: certificates = [], isLoading, error } = useCertificates();

  if (isLoading) {
    return (
      <section id="certificates" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="portfolio-text-gradient">Certificates</span> & Achievements
            </h2>
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="portfolio-text-gradient">Certificates</span> & Achievements
            </h2>
            <p className="text-destructive">Error loading certificates</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="portfolio-text-gradient">Certificates</span> & Achievements
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and achievements that validate my expertise and commitment to continuous learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border-0">
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-16 h-16 text-brand-primary opacity-20" />
                </div>
                
                {/* Certificate preview */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Award className="w-8 h-8 text-brand-primary" />
                      <Badge variant="secondary" className="text-xs">
                        {certificate.date}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">
                      {certificate.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {certificate.issuer}
                    </p>
                  </div>
                  
                  {certificate.credential_id && (
                    <div className="text-xs text-muted-foreground">
                      ID: {certificate.credential_id}
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {certificate.verification_url ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="glass-effect"
                      onClick={() => window.open(certificate.verification_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" className="glass-effect" disabled>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{certificate.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Issued by {certificate.issuer} • {certificate.date}
                </p>
                {certificate.credential_id && (
                  <p className="text-xs text-muted-foreground">
                    Credential ID: {certificate.credential_id}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;