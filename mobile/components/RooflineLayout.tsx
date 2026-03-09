import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

const RooflineLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          {/* Left: Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}><Text style={styles.logoTextR}>R</Text></View>
            <Text style={styles.logoText}>roofline</Text>
          </View>

          {/* Center: Navigation Tabs */}
          <View style={styles.centerNav}>
            <Text style={styles.navItem}>Home</Text>
            <Text style={styles.navItem}>Message</Text>
            <Text style={styles.navItem}>Wallet</Text>
            <Text style={styles.navItem}>Secure Vault</Text>
            <Text style={styles.navItem}>About</Text>
          </View>

          {/* Right: Auth Buttons */}
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupBtn}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MAIN CONTENT --- */}
        <View style={styles.mainContent}>
          {children}
        </View>

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            {/* Column 1: Roofline */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Roofline</Text>
              <Text style={styles.footerSubText}>
                The first intelligent cross-border property platform for the modern European buyer.
              </Text>
            </View>

            {/* Column 2: Platform */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Platform</Text>
              <Text style={styles.footerLink}>Document Vault</Text>
              <Text style={styles.footerLink}>Tax Estimates</Text>
              <Text style={styles.footerLink}>Mortgage Calculator</Text>
            </View>

            {/* Column 3: Support */}
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Support</Text>
              <Text style={styles.footerLink}>Contact Agent</Text>
              <Text style={styles.footerLink}>Privacy Policy</Text>
              <Text style={styles.footerLink}>Buying Guides</Text>
            </View>
          </View>

          {/* Footer Bottom Section */}
          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>© 2026 ROOFLINE</Text>
            <View style={styles.socialRow}>
              <Text style={styles.socialLink}>TWITTER</Text>
              <Text style={styles.socialLink}>INSTAGRAM</Text>
              <Text style={styles.socialLink}>GMAIL</Text>
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
    backgroundColor: '#F0F2F5', // Matches the light grey in header area
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150, // Fixed width to balance with auth side
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
    color: '#1F2937',
  },
  centerNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Takes up remaining space to center items
    gap: 20,
  },
  navItem: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 150, // Matches logoContainer width for perfect centering of nav
  },
  loginBtn: {
    marginRight: 15,
  },
  loginText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  signupBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  signupText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    minHeight: 500,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#0F172A',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  footerGrid: {
    flexDirection: 'row', // Align columns horizontally
    justifyContent: 'center', // Center the row
    alignItems: 'flex-start',
    gap: 60, // Spacing between adjacent columns
    flexWrap: 'wrap', // Wrap on smaller screens
  },
  footerColumn: {
    width: 220, // Give columns a standard width for alignment
  },
  footerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  footerSubText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 12,
  },
  footerBottom: {
    marginTop: 60,
    alignItems: 'center',
  },
  copyright: {
    color: '#475569',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 25,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 30,
  },
  socialLink: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default RooflineLayout;