import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Dimensions,
  Platform,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const RooflineLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigateTo = (path: any) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- MOBILE MENU OVERLAY --- */}
      <Modal
        visible={isMenuOpen}
        animationType="fade"
        transparent={false}
      >
        <SafeAreaView style={styles.mobileMenuContainer}>
          <View style={styles.menuHeader}>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Ionicons name="close" size={32} color="#1F2937" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuLinks}>
             <Text style={styles.menuLinkText}>Welcome to Roofline</Text>
          </View>

          <View style={styles.menuAuthSection}>
            <TouchableOpacity style={styles.mobileLoginBtn} onPress={() => navigateTo('/loginpage')}>
              <Text style={styles.mobileLoginText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileSignupBtn} onPress={() => navigateTo('/signinpage')}>
              <Text style={styles.mobileSignupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={() => router.push('/')}
          >
            <View style={styles.logoIcon}><Text style={styles.logoTextR}>R</Text></View>
            <Text style={styles.logoText}>roofline</Text>
          </TouchableOpacity>

          <View style={styles.rightSection}>
            {isMobile ? (
              <TouchableOpacity 
                style={styles.menuIcon} 
                onPress={() => setIsMenuOpen(true)}
              >
                <Ionicons name="menu" size={32} color="#1F2937" />
              </TouchableOpacity>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/loginpage')}>
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signinpage')}>
                  <Text style={styles.signupText}>Sign up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* --- MAIN CONTENT --- */}
        <View style={styles.mainContent}>
          {children}
        </View>

        {/* --- CENTERED FOOTER --- */}
        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Roofline</Text>
              <Text style={styles.footerSubText}>
                The first intelligent cross-border property platform for the modern European buyer.
              </Text>
            </View>

            <View style={[styles.footerColumn, isMobile && { marginTop: 30 }]}>
              <Text style={styles.footerTitle}>Platform</Text>
              <Text style={styles.footerLink}>Document Vault</Text>
              <Text style={styles.footerLink}>Tax Estimates</Text>
              <Text style={styles.footerLink}>Mortgage Calculator</Text>
            </View>

            <View style={[styles.footerColumn, isMobile && { marginTop: 30 }]}>
              <Text style={styles.footerTitle}>Support</Text>
              <Text style={styles.footerLink}>Contact Agent</Text>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>© 2026 ROOFLINE</Text>
            <View style={styles.socialRow}>
              <Text style={styles.socialLink}>TWITTER</Text>
              <Text style={styles.socialLink}>INSTAGRAM</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isMobile ? 20 : 40,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
    ...Platform.select({
      web: { position: 'sticky', top: 0 }
    })
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    backgroundColor: '#4F46E5',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoTextR: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: isMobile ? 40 : 150,
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    padding: 5,
  },
  loginBtn: {
    marginRight: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  signupBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  signupText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    minHeight: 600,
    backgroundColor: '#FFFFFF',
  },
  mobileMenuContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 25,
  },
  menuHeader: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  menuLinks: {
    flex: 1,
    gap: 30,
  },
  menuLinkText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuAuthSection: {
    gap: 15,
    marginBottom: 20,
  },
  mobileLoginBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mobileLoginText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  mobileSignupBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  mobileSignupText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  footer: {
    backgroundColor: '#0F172A',
    padding: 40,
    alignItems: 'center', // Added for centering
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Added for centering columns
    width: '100%',
  },
  footerColumn: {
    width: isMobile ? '100%' : 250,
    alignItems: 'center', // Added to center content within columns
  },
  footerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center', // Added for text centering
  },
  footerSubText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center', // Added for text centering
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center', // Added for text centering
  },
  footerBottom: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 20,
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center', // Changed to center bottom elements
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  copyright: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center', // Added for text centering
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center', // Added for centering socials
  },
  socialLink: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
  }
});

export default RooflineLayout;