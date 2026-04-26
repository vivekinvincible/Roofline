import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  const { signOut, userToken } = useAuth(); // Get auth state
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
            <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('/')}>
              <Text style={styles.menuLinkText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('/')}>
              <Text style={styles.menuLinkText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('/wallet')}>
              <Text style={styles.menuLinkText}>Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('/modal')}>
              <Text style={styles.menuLinkText}>Secure Vault</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuAuthSection}>
            <TouchableOpacity style={styles.mobileProfileBtn} onPress={() => navigateTo('/profile')}>
              <Ionicons name="person-circle-outline" size={24} color="#FFF" />
              <Text style={styles.mobileProfileText}>My Profile</Text>
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
        {/* Logo Section */}
        <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/home')}>
           <View style={styles.logoIcon}><Text style={styles.logoTextR}>R</Text></View>
           <Text style={styles.logoText}>roofline</Text>
        </TouchableOpacity>

          {/* Navigation Links - Only show if userToken exists */}
        {!isMobile && userToken && (
            <View style={styles.centerNav}>
              <TouchableOpacity onPress={() => router.push('/home')}>
                <Text style={styles.navItem}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/home')}>
                <Text style={styles.navItem}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/wallet')}>
                <Text style={styles.navItem}>Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/modal')}>
                <Text style={styles.navItem}>Secure Vault</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.rightSection}>
          {userToken ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <TouchableOpacity onPress={signOut}>
                <Text style={{ color: '#EF4444', fontWeight: '700' }}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/home')}>
                <Ionicons name="person-circle-sharp" size={36} color="#0F172A" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => router.push('/loginpage')}>
               <Text style={styles.navItem}>Login</Text>
            </TouchableOpacity>
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

            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Platform</Text>
              <Text style={styles.footerLink}>Document Vault</Text>
              <Text style={styles.footerLink}>Tax Estimates</Text>
              <Text style={styles.footerLink}>Mortgage Calculator</Text>
            </View>

            <View style={styles.footerColumn}>
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
      web: { position: 'sticky', top: 0 } as any
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
  centerNav: {
    flexDirection: 'row',
    gap: 24,
  },
  navItem: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: isMobile ? 40 : 60,
  },
  profileBtn: {
    padding: 2,
  },
  menuIcon: {
    padding: 5,
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
  menuLinkItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 15,
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
  mobileProfileBtn: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    gap: 10,
  },
  mobileProfileText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  footer: {
    backgroundColor: '#0F172A',
    padding: 40,
    alignItems: 'center',
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  footerColumn: {
    width: isMobile ? '100%' : 250,
    alignItems: 'center',
    marginBottom: isMobile ? 30 : 0,
  },
  footerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center',
  },
  footerSubText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  footerBottom: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 20,
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  copyright: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  socialLink: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
  }
});

export default RooflineLayout;