import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RooflineLayout from '@/components/RooflineLayout';

export default function LoginPage() {
  return (
    <RooflineLayout>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome Back</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="facebook-square" size={32} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="linkedin-square" size={32} color="#0077b5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="google" size={32} color="#DB4437" />
            </TouchableOpacity>
          </View>

          <View style={styles.footerTextRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB', // Matches the light background in your image
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 24, // High border radius for that "premium" look
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 40,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  forgotText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  loginButton: {
    backgroundColor: '#0F172A', // Dark navy/black button from the image
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 24,
  },
  socialIcon: {
    padding: 4,
  },
  footerTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '800',
    marginLeft: 6,
  },
});