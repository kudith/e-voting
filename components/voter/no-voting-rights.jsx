"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  Calendar,
  Shield,
  AlertCircle,
  Lock,
  Info,
} from "lucide-react";

export default function NoVotingRights({ voter }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-lg font-semibold">Hak Pilih Tidak Aktif</AlertTitle>
            <AlertDescription className="mt-2 text-muted-foreground">
              Maaf, {voter?.name}. Saat ini Anda belum memiliki hak pilih aktif untuk pemilihan apapun. 
              Silakan hubungi administrator sistem untuk informasi lebih lanjut mengenai status hak pilih Anda.
            </AlertDescription>
          </Alert>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profil Pemilih
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{voter?.name}</h3>
                      <p className="text-sm text-muted-foreground">{voter?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fakultas</p>
                        <p className="font-medium text-foreground">{voter?.faculty?.name || 'Belum ditentukan'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jurusan</p>
                        <p className="font-medium text-foreground">{voter?.major?.name || 'Belum ditentukan'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tahun Angkatan</p>
                        <p className="font-medium text-foreground">{voter?.year || 'Belum ditentukan'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge 
                          variant={voter?.status === 'active' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {voter?.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Status Pemilihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Status Hak Pilih</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Tidak Aktif
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Status Memilih</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Belum Memilih
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - No Voting Rights Message */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Informasi Hak Pilih
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 hover:bg-destructive/20 transition-colors">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Hak Pilih Tidak Aktif</h3>
                      <p className="text-muted-foreground mt-2">
                        Saat ini Anda tidak memiliki hak pilih aktif untuk pemilihan apapun. 
                        Silakan hubungi administrator sistem untuk informasi lebih lanjut.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Keamanan Sistem</h3>
                        <p className="text-muted-foreground mt-2">
                          Sistem pemilihan ini menggunakan teknologi blockchain untuk memastikan 
                          keamanan dan transparansi dalam proses pemilihan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20 transition-colors">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Verifikasi Identitas</h3>
                        <p className="text-muted-foreground mt-2">
                          Pastikan data diri Anda sudah terverifikasi dan lengkap untuk 
                          mendapatkan hak pilih dalam pemilihan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" size="lg">
                      <Mail className="h-4 w-4 mr-2" />
                      Hubungi Administrator
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 